import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCliqued, setIsCliqued] = useState(false)

  return (
    <>
      {/* Mobile Toggle Button - Fixed to left with full height */}
      <button 
        className={isCliqued ? `bt-none`:`md:hidden top-0 bottom-0 left-0 z-50 bg-[#18181b] flex items-start justify-center w-12`}
        onClick={
          () => {
            setIsOpen(!isOpen);
            setIsCliqued(!isCliqued)
          }
        }
      >
        {isOpen ? <div className="w-12 my-5"></div> : <Menu className="text-white my-5" />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-40 bg-[#18181b] text-white 
          w-56 min-h-screen 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:relative
        `}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Bourbon Coffee</h1>
          {/* Close button for mobile */}
          <button 
            className="md:hidden"
            onClick={() => {
              setIsOpen(false);
              setIsCliqued(false)
            }}
          >
            <X className="text-white" />
          </button>
        </div>
        <nav className="mt-4">
          <a href="/" 
            className="block w-full"
            onClick={() => setIsOpen(false)}
          >
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-gray-700 hover:text-white"
            >
              Dashboard
            </Button>
          </a>
          <a href="/edito" 
            className="block w-full"
            onClick={() => setIsOpen(false)}
          >
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-gray-700 hover:text-white"
            >
              Editos
            </Button>
          </a>
          <a href="/partenaires" 
            className="block w-full"
            onClick={() => setIsOpen(false)}
          >
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-gray-700 hover:text-white"
            >
              Partenaires
            </Button>
          </a>
          <a href="/blog" 
            className="block w-full"
            onClick={() => setIsOpen(false)}
          >
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-gray-700 hover:text-white"
            >
              Articles
            </Button>
          </a>
        </nav>
      </aside>
    </>
  );
}