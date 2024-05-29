"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getWithExpiry } from "./components/functions";

type FormValues = {
	title: string;
};

export default function App() {
	const router = useRouter();
	const { register, handleSubmit } = useForm<FormValues>();
	const [todos, setTodos] = useState<any[]>([]); // Add type annotation for todos
	const [loading, setLoading] = useState<boolean>(true);

	const onSubmit = (data: FormValues) => {
		fetch(`https://6653697c1c6af63f4674a111.mockapi.io/api/users/${getWithExpiry("user")}/todoLists`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.catch((error) => console.error(error));
	};

	const deleteTodo = (id: number) => {
		fetch(`https://6653697c1c6af63f4674a111.mockapi.io/api/users/${getWithExpiry("user")}/todoLists/${id}`, {
			method: "DELETE",
		})
			.then((response) => response.json())
			.catch((error) => console.error(error));
	};

	useEffect(() => {
		getWithExpiry("user");
		if (!getWithExpiry("user")) {
			router.push("/login");
		}
		fetch(`https://6653697c1c6af63f4674a111.mockapi.io/api/users/${getWithExpiry("user")}/todoLists`)
			.then((response) => response.json())
			.then((responseData) => {
				setTodos(responseData);
				setLoading(false);
			})
			.catch((error) => console.error(error));
	}, [todos, loading]);

	if (loading === true) {
		return (
			<div className="flex justify-center items-center h-screen w-full">
				<span className="loading loading-spinner w-12"></span>
			</div>
		);
	} else {
		return (
			<main className="flex min-h-screen flex-col items-center justify-between p-24">
				<div className="flex flex-col items-end w-full" style={{ padding: "20px" }}>
					<button
						className="btn btn-primary"
						onClick={() => {
							localStorage.removeItem("user");
							router.push("/login");
						}}
					>
						Logout
					</button>
					<button
						className="btn btn-primary"
						onClick={() => (document.getElementById("my_modal") as HTMLDialogElement)?.showModal()}
					>
						+
					</button>
				</div>
				{todos.map(({ id, createdAt, title }) => (
					<div key={"key" + id}>
						<Link className="btn btn-primary" href={`/todo-list/${id}`}>
							<p>{createdAt}</p>
							<p>{title}</p>
						</Link>
						<button className="btn btn-error" onClick={() => deleteTodo(id)}>
							Delete
						</button>
					</div>
				))}
				<dialog id="my_modal" className="modal">
					<div className="modal-box">
						<form method="dialog">
							<button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
						</form>
						<h3 className="font-bold text-lg mb-3">New todo list</h3>
						<form onSubmit={handleSubmit(onSubmit)}>
							<input {...register("title")} className="input input-bordered w-full" type="text" placeholder="Title" />
							<div className="modal-action">
								<button
									type="submit"
									className="btn"
									onClick={() => (document.getElementById("my_modal") as HTMLDialogElement)?.close()}
								>
									Add
								</button>
							</div>
						</form>
					</div>
					<form method="dialog" className="modal-backdrop">
						<button>close</button>
					</form>
				</dialog>
			</main>
		);
	}
}
