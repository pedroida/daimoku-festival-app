import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { CreateDistritoModal } from '~/components/common/CreateDistritoModal'
import { AppHeader } from '~/components/common/Header'
import { ButtonComponent } from '~/components/ui/button'
import type { Distrito } from '~/domain/entities/Distrito'
import useHttpRequest from '~/hooks/common/useHttpRequest'

export const Component = () => {
  const httpClient = useHttpRequest()
  const [isOpen, setIsOpen] = useState(false)
  const [distritos, setDistritos] = useState<Distrito[]>([])

  useEffect(() => {
    const fetchDistritos = async () => {
      const response = await httpClient.get<Distrito[]>('/distritos')
      if (response) {
        setDistritos(response)
      }
    }
    fetchDistritos()
  }, [])

  const sortedDistritos = useMemo(() => {
    return [...distritos].sort((a, b) => a.name.localeCompare(b.name))
  }, [distritos])
  
  const addDistrito = (distrito: Distrito) => {
    httpClient.post<Distrito, Distrito>('/distritos', distrito)
    .then((response) => {
      if (response) {
        setDistritos([...sortedDistritos, response])
        toast.success('Distrito adicionado com sucesso')
      }
    })
    .catch((error) => {
      toast.error(error.response.data.error)
    })
  }

  return (
    <div className="min-h-screen transition-colors bg-background text-text">
      {/* Navigation */}
      <AppHeader />


      <div className="max-w-6xl mx-auto px-6">
        {/* Tech Stack */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-text mb-4">
              Distritos da RM Campos Gerais
            </h2>
            <p className="text-text-secondary mb-6">
              Caso não encontre seu distrito na lista, clique no botão abaixo para criar.
            </p>
            <ButtonComponent
              onClick={() => setIsOpen(true)}
              variant="primary"
              size="md"
              className="cursor-pointer"
            >
              Adicionar Distrito
            </ButtonComponent>
            <CreateDistritoModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              addDistrito={addDistrito}
            />
          </div>
        </section>

        {/* Interactive Demo */}
        <section>
          <div className="overflow-hidden rounded-lg border border-border bg-material-thin mb-16">
            <table className="w-full">
              <thead className="bg-fill/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text">
                    Nome do Distrito
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {sortedDistritos.map((item, index) => (
                  <tr 
                    key={item.id}
                    className={`
                      transition-colors duration-200
                      ${index % 2 === 0 ? 'bg-background' : 'bg-fill/20'}
                      hover:bg-fill/40
                    `}
                  >
                    <td className="px-6 py-4 text-sm text-text">
                      {item.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
