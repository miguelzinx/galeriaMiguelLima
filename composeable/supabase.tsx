const SUPABASE_URL = 'https://oagwapllahtnjtmrwriq.supabase.co'
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ3dhcGxsYWh0bmp0bXJ3cmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MTg0NTEsImV4cCI6MjA3MTI5NDQ1MX0.giH5mH8OCKJ3_hsZKi3Dpg4X_LZAQohDhNS4-zaHOTk'

const supabase = createClient('SUPABASE_URL', 'SUPABASE_API_KEY')

interface Arquivo {
    path: string,
    file: string
}

const BUCKET = "galeria";
const PATH_IMAGE = 'arquivos';
const PATH_PROFILE = 'profile';

const sendFileToSupabase = async ({ file, path }: Arquivo): Promise<void> => {
    const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(PATH_PROFILE, file)
    if (error) {
        console.error(error.message);
    } else {
        console.log("Salvou!!!!")
    }
}

const removeFileFromSupabase = async ({ file, path }: Arquivo): Promise<void> => {

    const { data, error } = await supabase.storage
        .from(BUCKET)
        .remove([`${PATH_PROFILE} / ${path}`])
    if (error) {
        console.error(error.message);
    } else {
        console.log("Removeu!!!!!")
    }
}

const downloadFileFromSupabase = async ({ file, path }: Arquivo): Promise<void> => {

    const { data, error } = await supabase.storage
        .from(BUCKET)
        .download(`PATH_PROFILE / ${file}`)
    if (error) {
        console.error(error.message);
    } else {
        console.log("Removeu!!!!!")
    }
}