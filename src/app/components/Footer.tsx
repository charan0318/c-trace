export function Footer() {
    return (
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg font-semibold text-chiliz-primary mb-2">#BuiltOnChiliz</p>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Thirdweb. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    )
  }
  
  