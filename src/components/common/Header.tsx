import clsx from "clsx"
import type { FC } from "react"
import { Link, useLocation, useNavigate } from "react-router"

import bsgi from "~/assets/img/bsgi.png"

import { Tooltip } from "../ui/tooltip"
import { TooltipContent, TooltipTrigger } from "../ui/tooltip/Tooltip"

export const AppHeader: FC = () => {
  const navigate = useNavigate()
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
            </div>
          </div>
        </div>
      </nav>
    )
}