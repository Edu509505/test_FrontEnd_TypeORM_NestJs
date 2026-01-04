import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import z from "zod";

import {
  useMutation,
  useQueryClient,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../field";

import { Card, CardContent, CardFooter } from "../card";
import { CircleCheckBigIcon, CirclePlus, CircleX } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../alert-dialog";
import { Spinner } from "../spinner";

function VisualizacaoDialogCreate() {
  const url = "http://localhost:3000";

  // const [closerDialog, setCloserDialog] = useState<boolean>(false);
  // const [erroAoCadastrar, setErroAoCadastrar] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const formSchema = z.object({
    name: z.string().min(3, { message: "Insira um nome válido" }),
    email: z.email({ message: "Insira um E-Mail válido" }),
    password: z
      .string()
      .min(8, { message: "A Senha deve conter no mínimo 8 caracteres" }),
  });
  const formCliet = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const criarUsuario = useMutation({
    mutationKey: ["crateUsuario"],
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await fetch(`${url}/users`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const txt = await response.text();
        console.log(data);
        throw new Error(txt || `Erro ${response.status}`);
      }
      return response.json();
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    criarUsuario.mutateAsync(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" onClick={() => formCliet.reset()}>
          <CirclePlus /> Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar um novo usuário</DialogTitle>
          <DialogDescription>
            Digite as informações para adicionar um novo usuário
          </DialogDescription>
        </DialogHeader>
        <Card className="w-full">
          <CardContent>
            <form
              id="form-rhf-demo"
              onSubmit={formCliet.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <Controller
                  name="name"
                  control={formCliet.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-title">
                        Nome
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-demo-title"
                        aria-invalid={fieldState.invalid}
                        placeholder="Nome"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="email"
                  control={formCliet.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-title">
                        E-Mail
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-demo-title"
                        aria-invalid={fieldState.invalid}
                        placeholder="E-Mail"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={formCliet.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-title">
                        Senha
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-demo-title"
                        aria-invalid={fieldState.invalid}
                        placeholder="Senha"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => formCliet.reset()}
                className="cursor-pointer"
              >
                Resetar
              </Button>

              <Button
                type="submit"
                className="cursor-pointer"
                variant="default"
                form="form-rhf-demo"
                disabled={criarUsuario.isPending}
              >
                {criarUsuario.isPending ? (
                  <>
                    <Spinner /> Cadastrar
                  </>
                ) : (
                  "Cadastrar"
                )}
              </Button>
              {/* sucesso */}
              <AlertDialog
                open={criarUsuario.isSuccess}
                onOpenChange={(open) => {
                  if (!open) criarUsuario.reset();
                }}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-green-600 flex items-center gap-3">
                      <CircleCheckBigIcon />
                      Usuario cadastrado com sucesso
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Usuario cadastrado e inserido no sistema
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <DialogClose>
                      <AlertDialogCancel>
                        <Button
                          onClick={() => {
                            queryClient.invalidateQueries({
                              queryKey: ["tabela"],
                            });
                            formCliet.reset();
                          }}
                        >
                          Continuar
                        </Button>
                      </AlertDialogCancel>
                    </DialogClose>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* erro */}
              <AlertDialog
                open={criarUsuario.isError}
                onOpenChange={(open) => {
                  if (!open) criarUsuario.reset();
                }}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-700 flex items-center gap-3">
                      <CircleX /> Erro ao cadastrar usuario
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      A ação de cadastrar usuario falhou. Tente novamente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Fechar</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Field>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

function VisualizacaoIsLoading() {
  return <h1>Loading</h1>;
}

function ErrorFallBack({
  error,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return <h1>Erro: {error.message}</h1>;
}

export function DialogCreate() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallBack error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<VisualizacaoIsLoading />}>
        <VisualizacaoDialogCreate />
      </Suspense>
    </ErrorBoundary>
  );
}
