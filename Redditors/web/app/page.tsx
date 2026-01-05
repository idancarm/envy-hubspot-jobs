'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface Account {
    id: string
    username: string
    is_active: boolean
    current_persona_id: string
}

interface Persona {
    id: string
    name: string
}

export default function Home() {
    const [accounts, setAccounts] = useState<Account[]>([])
    const [personas, setPersonas] = useState<Persona[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const { data: accData } = await supabase.from('accounts').select('*')
            const { data: persData } = await supabase.from('personas').select('*')

            setAccounts(accData || [])
            setPersonas(persData || [])
            setLoading(false)
        }
        fetchData()
    }, [])

    if (loading) return <div className="p-10">Loading...</div>

    return (
        <main className="min-h-screen p-8 font-sans">
            <h1 className="text-3xl font-bold mb-8">Redditor Agent Dashboard</h1>

            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4">Active Bots</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {accounts.map(acc => (
                        <div key={acc.id} className="p-6 border rounded-lg shadow-sm bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-lg">{acc.username}</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${acc.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {acc.is_active ? 'Active' : 'Paused'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                                Persona: {personas.find(p => p.id === acc.current_persona_id)?.name || 'None'}
                            </p>
                            <div className="text-xs text-gray-400">ID: {acc.id}</div>
                        </div>
                    ))}
                    {accounts.length === 0 && (
                        <p className="text-gray-500 italic">No accounts found. run SQL schema to populate.</p>
                    )}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Configuration</h2>
                <p className="text-gray-600 mb-4">
                    Manage your personas and targets in the database directly (for now) or use the API.
                </p>
                <div className="p-4 bg-gray-50 border rounded text-sm font-mono">
                    Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Connected' : 'Missing'}
                </div>
            </section>
        </main>
    )
}
