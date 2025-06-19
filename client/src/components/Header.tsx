import { Link, useLocation } from "wouter";
import { Search, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const NavLinks = () => (
    <>
      <Link href="/stories">
        <Button variant="ghost" className={location === "/stories" ? "text-[#2B5A3E]" : ""}>
          Stories
        </Button>
      </Link>
      <Link href="/stories?category=all">
        <Button variant="ghost">Categories</Button>
      </Link>
      <Button variant="ghost">About</Button>
      <Link href="/admin">
        <Button variant="ghost" className={location === "/admin" ? "text-[#2B5A3E]" : ""}>
          Admin
        </Button>
      </Link>
    </>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <h1 className="text-2xl font-bold text-[#2B5A3E] font-serif">कहानी</h1>
              <span className="ml-2 text-sm text-[#2C3E50] opacity-75">Kahani</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <NavLinks />
          </nav>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Input
                type="search"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full focus:ring-2 focus:ring-[#2B5A3E]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </form>
            
            <Link href="/submit">
              <Button className="bg-[#2B5A3E] text-white px-4 py-2 rounded-full hover:bg-opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Share Story
              </Button>
            </Link>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
