import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

import {
  useMutation,
  useQueryClient,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

import { CircleCheckBigIcon, CircleX, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../alert-dialog";
import { Spinner } from "../spinner";

import { Skeleton } from "../skeleton";

interface Props {
  id: string;
}

function VisualizarDeleteUser({ id }: Props) {
  const url = "http://localhost:3000";

  const queryClient = useQueryClient();

  const deleteUser = useMutation({
    mutationKey: ["deleteUser", id],
    mutationFn: async () => {
      const response = await fetch(`${url}/users/delete/user/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || `Erro ${response.status}`);
      }
      return response.json();
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="cursor-pointer">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Deseja deletar o usuário selecionado?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se confirmado a ação não poderá ser desfeita
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel type="button" className="cursor-pointer">
            Cancelar
          </AlertDialogCancel>

          <Button
            className="cursor-pointer"
            onClick={() => deleteUser.mutateAsync()}
            variant="default"
            disabled={deleteUser.isPending}
          >
            {deleteUser.isPending ? (
              <>
                <Spinner /> Deletar
              </>
            ) : (
              "Deletar"
            )}
          </Button>
          {/* sucesso */}
          <AlertDialog open={deleteUser.isSuccess}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-green-600 flex items-center gap-3">
                  <CircleCheckBigIcon />
                  Usuario Deletado com sucesso
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Usuario Deletado do sistema
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  <Button
                    onClick={() => {
                      queryClient.invalidateQueries({
                        queryKey: ["tabela"],
                      });
                    }}
                  >
                    Continuar
                  </Button>
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* erro */}
          <AlertDialog open={deleteUser.isError}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-700 flex items-center gap-3">
                  <CircleX /> Erro ao Deletar usuario
                </AlertDialogTitle>
                <AlertDialogDescription>
                  A ação de Deletar usuario falhou. Tente novamente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  <Button>Voltar</Button>
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteUserIsLoading() {
  return (
    <>
      <Skeleton />
    </>
  );
}

function ErrorFallBack({
  error,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return <h1>Erro: {error.message}</h1>;
}

export function DeleteUser({ id }: Props) {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallBack error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<DeleteUserIsLoading />}>
        <VisualizarDeleteUser id={id} />
      </Suspense>
    </ErrorBoundary>
  );
}
