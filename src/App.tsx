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

interface Users {
  id: String;
  name: String;
  email: string;
  password: string;
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
      console.log(data);
      return data as Users[];
    },
  });

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <main className="flex flex-col justify-center items-center gap-3">
        <h1>Cadastro de Usuarios</h1>
        <div className="border-1 border-black rounded-2xl">
          <Table className="">
            <TableCaption>Tabela de usuarios Cadastrados</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Senha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tabelaUsers?.map((item) => (
                <TableRow>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.password}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}

export default App;
