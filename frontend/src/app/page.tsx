import { Metadata } from 'next'
import SearchForm from "@/components/SearchForm";
import ToastProvider from "@/components/providers/ToastProvider";
import TopHeader from "@/layout/TopHeader";

export const metadata: Metadata = {
  title: 'GARDEN',
  description: 'Welcome to GARDEN',
}

export default function Home() {
  return (
      <div className="min-h-screen bg-navy">
        <TopHeader/>
        <SearchForm/>
      </div>
  )
}