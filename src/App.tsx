import { useQuery } from "@tanstack/react-query";
import "./App.css";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { format } from "date-fns";
import { DialogCreate } from "./components/ui/dialogCreate/dialogCreate";
import { EditUser } from "./components/ui/dialogCreate/dialogEdit";
import { Button } from "./components/ui/button";
import { Trash2 } from "lucide-react";
import { DeleteUser } from "./components/ui/dialogCreate/alertDialogDelete";

interface Users {
  id: String;
  name: String;
  email: string;
  password: string;
  createdAt: string;
}

function App() {
  const url = "http://localhost:3000";

  const { data: tabelaUsers } = useQuery({
    queryKey: ["tabela"],
    queryFn: async () => {
      const response = await fetch(`${url}/users`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Nenhum usuario foi encontrado");

      const data = await response.json();
      return data as Users[];
    },
  });

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <main className="flex flex-col justify-center items-center gap-3">
        <h1>Cadastro de Usuarios</h1>

        <div className="w-[800px] flex flex-row-reverse">
          <DialogCreate />
        </div>
        <div className="border-1 border-black rounded-2xl w-[800px]">
          <Table className="">
            <TableCaption>Tabela de usuarios Cadastrados</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Senha</TableHead>
                <TableHead>Entrada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tabelaUsers && tabelaUsers.length > 0 ? (
                tabelaUsers?.map((item) => (
                  <TableRow>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.password}</TableCell>
                    <TableCell>
                      {format(new Date(item.createdAt), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <EditUser id={item.id as string} />
                      <DeleteUser id={item.id as string} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <>
                  <h1>Nenhum Dado encontrado</h1>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}

export default App;
