export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background-secondary">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* 主要内容 */}
          <div className="flex items-center space-x-3 text-sm text-text-secondary">
            <span>Made with ❤️ by</span>
            <a
              href="https://github.com/pedroida"
              target="_blank"
              rel="noopener noreferrer"
              className="h-auto p-0 text-text-secondary hover:text-text font-medium flex items-center space-x-1"
            >
              <i className="i-mingcute-github-line text-base" />
              <span>@pedroida</span>
            </a>
          </div>

          <div className="text-xs text-text-tertiary text-center">
            © {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
