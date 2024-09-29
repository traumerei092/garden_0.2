import { Metadata } from 'next'
import SearchForm from "@/components/SearchForm";

export const metadata: Metadata = {
  title: 'GARDEN',
  description: 'Welcome to GARDEN',
}

export default function Home() {
  return (
      <div className="min-h-screen bg-navy">
        <SearchForm/>
      </div>
  )
}