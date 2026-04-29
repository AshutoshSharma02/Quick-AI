import { neon } from '@neondatabase/serverless'

// Ensure a global `fetch` is available for environments without it (Node <18).
if (typeof globalThis.fetch === 'undefined') {
	try {
		const nodeFetch = await import('node-fetch')
		globalThis.fetch = nodeFetch.default ?? nodeFetch
	} catch (err) {
		console.warn('Warning: `fetch` is not available and `node-fetch` could not be loaded.', err)
	}
}

// Trim possible surrounding quotes from the DATABASE_URL value
const rawUrl = process.env.DATABASE_URL || ''
const DATABASE_URL = rawUrl.replace(/^['"]|['"]$/g, '').trim()

// Diagnostic: avoid printing secrets; show only basic validity info
try {
	console.log('DB URL present:', DATABASE_URL.length > 0, 'startsWith postgres:', DATABASE_URL.startsWith('postgres'))
} catch (e) {
	// ignore diagnostics in constrained environments
}

let sql
try {
	sql = neon(DATABASE_URL)
} catch (e) {
	console.error('Failed to initialize Neon client:', e && (e.stack || e.message || e))
	// Export a stub that throws when used so the server can start and routes can handle errors gracefully
	sql = {
		query: () => { throw new Error('Database client not initialized') },
		// support tagged-template usage by throwing descriptive error
		bind: () => { throw new Error('Database client not initialized') }
	}
}

export default sql