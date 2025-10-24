import clsx from "clsx"
import type { FC } from "react"
import { Link, useLocation, useNavigate } from "react-router"

import bsgi from "~/assets/img/bsgi.png"
import { useSetTheme, useThemeAtomValue } from "~/hooks/common"

import { Tooltip } from "../ui/tooltip"
import { TooltipContent, TooltipTrigger } from "../ui/tooltip/Tooltip"

export const AppHeader: FC = () => {
  const navigate = useNavigate()
  const theme = useThemeAtomValue()
  const setTheme = useSetTheme()
  const themeOptions = [
    { value: 'light', icon: 'i-mingcute-sun-line', label: 'Light' },
    { value: 'dark', icon: 'i-mingcute-moon-line', label: 'Dark' },
  ] as const

  const goToHome = () => {
    navigate('/')
  }

  const location = useLocation()

    return (
        <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between sm:flex-row flex-col sm:gap-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-20 rounded-sm flex items-center justify-center">
                <img src={bsgi} alt="Daimoku para o Festival Cultural de Março" className="w-full h-full object-contain cursor-pointer" onClick={() => goToHome()} />
              </div>
              <span className="font-semibold hidden lg:block lg:text-base">
                Daimoku para o Festival Cultural
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link 
              to={"/"}
              className={clsx(['py-1 px-2 rounded-sm text-text hover:text-text-secondary', {
                'bg-sky-300': location.pathname === '/'
              }])}
              >
                Página Inicial
              </Link>
              <span>|</span>
              <Link 
              to={"/distritos"} 
              className={clsx(['py-1 px-2 rounded-sm text-text hover:text-text-secondary', {
                'bg-sky-300': location.pathname === '/distritos'
              }])}>
                Distritos
              </Link>
              <div className="flex items-center gap-1 p-1 bg-material-medium rounded-lg">
                {themeOptions.map(({ value, icon, label }) => (
                  <Tooltip key={value}>
                    <TooltipTrigger>
                      <button
                        type="button"
                        onClick={() => setTheme(value)}
                        className={`
                          size-7 flex items-center justify-center rounded-md transition-all text-xs font-medium
                          ${
                            theme === value
                              ? 'bg-background text-text shadow-sm'
                              : 'text-placeholder-text hover:text-text'
                          }
                        `}
                      >
                        <i className={`${icon} w-4 h-4`} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>{label}</span>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
}