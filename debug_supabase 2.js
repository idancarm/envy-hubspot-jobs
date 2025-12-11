import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    console.log("Testing connection...")

    // 1. Check services count
    const { count, error: countError } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })

    if (countError) {
        console.error("Error connecting:", countError)
        return
    }

    console.log(`Found ${count} services in database.`)

    // 2. Try to insert a dummy service if empty
    if (count === 0) {
        console.log("Database is empty. The default services in the UI are ghosts.")
    } else {
        // List IDs to see if they match 1,2,3,4
        const { data: services } = await supabase.from('services').select('id, name')
        console.log("Existing Service IDs:", services.map(s => s.id))
    }
}

testConnection()
