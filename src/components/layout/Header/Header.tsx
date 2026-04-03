import ThemeToggle from '@/components/ui/ThemeToggle/ThemeToggle'

export default function Header() {
    return (
        <header className='flex items-center justify-end p-4'>
            <ThemeToggle/>
        </header>
    )
}
