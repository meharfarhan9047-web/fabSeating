// Regression checks: no external email is sent and no production data is changed.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

async function checkEnquiry() {
  let providerError = null
  let calls = 0
  const output = ts.transpileModule(fs.readFileSync('app/api/enquiry/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const environment = { RESEND_API_KEY: undefined }
  const box = {
    exports: {}, process: { env: environment }, console: { error() {} },
    require(name) {
      if (name === 'zod') return require('zod')
      if (name === 'next/server') return { NextResponse: { json: (body, options) => ({ body, status: options?.status || 200 }) } }
      if (name === 'resend') return { Resend: class { emails = { send: async () => { calls++; return { error: providerError } } } } }
      throw new Error(name)
    },
  }
  vm.runInNewContext(output, box)
  const valid = { name: 'Test', email: 'test@example.com', phone: '123', message: 'Test enquiry' }
  const submit = (body) => box.exports.POST({ json: async () => body })
  assert.equal((await submit(valid)).status, 503)
  assert.equal(calls, 0)
  environment.RESEND_API_KEY = 'test-only'
  providerError = { name: 'validation_error' }
  assert.equal((await submit(valid)).status, 502)
  providerError = null
  assert.equal((await submit(valid)).status, 200)
  assert.equal((await submit({ ...valid, email: 'invalid' })).status, 400)
  console.log('PASS enquiry: missing configuration / provider rejection / success / invalid input')
}

async function checkWorker() {
  const handlers = {}, stores = new Map()
  const storage = {
    keys: async () => [...stores.keys()],
    delete: async (key) => stores.delete(key),
    open: async (name) => {
      if (!stores.has(name)) stores.set(name, new Map())
      const store = stores.get(name)
      return { put: async (key, value) => store.set(key, value), keys: async () => [...store.keys()], delete: async (key) => store.delete(key), match: async (key) => store.get(key) }
    },
  }
  let offline = false
  const box = {
    self: { location: { origin: 'https://test.local' }, addEventListener: (name, fn) => handlers[name] = fn, skipWaiting: async () => {}, clients: { claim: async () => {} } },
    caches: storage, URL, Response,
    fetch: async () => { if (offline) throw Error('Offline'); return new Response('<html>fresh CMS content</html>', { headers: { 'content-type': 'text/html' } }) },
  }
  vm.runInNewContext(fs.readFileSync('public/sw.js', 'utf8'), box)
  stores.set('unrelated-app', new Map())
  stores.set('fabseating-v2', new Map())
  let activation
  handlers.activate({ waitUntil: (promise) => activation = promise }); await activation
  assert(stores.has('unrelated-app')); assert(!stores.has('fabseating-v2'))
  async function run(path, mode = 'navigate') {
    let response, work
    handlers.fetch({ request: { method: 'GET', mode, url: 'https://test.local' + path, headers: new Headers() }, respondWith: (promise) => response = promise, waitUntil: (promise) => work = promise })
    const result = await response; await work; return result
  }
  assert.equal(await run('/projects?_rsc=123', 'cors'), undefined)
  assert.equal(await run('/api/enquiry'), undefined)
  assert.equal(await run('/admin'), undefined)
  for (let index = 0; index < 35; index++) await run('/page-' + index)
  assert.equal(stores.get('fabseating-v3').size, 30)
  offline = true
  assert.equal(await (await run('/page-34')).text(), '<html>fresh CMS content</html>')
  assert.equal((await run('/uncached')).type, 'error')
  console.log('PASS worker: RSC/API/admin bypass, bounded cache, offline fallback, scoped cleanup')
}

Promise.resolve().then(checkEnquiry).then(checkWorker).catch((error) => { console.error(error); process.exitCode = 1 })
