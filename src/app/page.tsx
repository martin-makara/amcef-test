"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getWithExpiry } from "./components/functions";

type FormValues = {
	title: string;
	createAt: string;
};

export default function App() {
	const router = useRouter();
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<FormValues>();
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
			.then(() => setLoading(true))
			.catch((error) => console.error(error));
	};

	const deleteTodo = (id: number) => {
		fetch(`https://6653697c1c6af63f4674a111.mockapi.io/api/users/${getWithExpiry("user")}/todoLists/${id}`, {
			method: "DELETE",
		})
			.then((response) => response.json())
			.then(() => setLoading(true))
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
			<main className="flex min-h-screen flex-col items-center p-8">
				<div className="flex w-full justify-between items-center">
					<div className="breadcrumbs w-full">
						<ul>
							<li>
								<Link href="/">Home</Link>
							</li>
						</ul>
					</div>
					<h1 className="w-full text-center text-4xl">Todo List</h1>
					<div className="flex justify-end w-full">
						<button
							className="btn btn-primary"
							onClick={() => {
								localStorage.removeItem("user");
								setLoading(true);
								router.push("/login");
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								fill="white"
								className="bi bi-box-arrow-right"
								viewBox="0 0 16 16"
							>
								<path
									fill-rule="evenodd"
									d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
								/>
								<path
									fill-rule="evenodd"
									d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
								/>
							</svg>
						</button>
					</div>
				</div>
				<div className="flex flex-col w-1/2 mt-20">
					<div className="overflow-x-auto">
						<table className="table">
							<thead>
								<tr className="bg-neutral">
									<th></th>
									<th>Name</th>
									<th>Created At</th>
									<th className="flex justify-end">
										<button
											className="btn btn-primary"
											onClick={() => (document.getElementById("my_modal") as HTMLDialogElement)?.showModal()}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
												fill="white"
												className="bi bi-plus-circle-fill"
												viewBox="0 0 16 16"
											>
												<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
											</svg>
										</button>
									</th>
								</tr>
							</thead>
							<tbody>
								{todos.map(({ id, createdAt, title }) => (
									<tr className="bg-base-300 hover" key={"key" + id}>
										<th className="cursor-pointer" onClick={() => router.push(`/todo-list/${id}`)}>
											{id}
										</th>
										<th className="cursor-pointer" onClick={() => router.push(`/todo-list/${id}`)}>
											{title}
										</th>
										<th className="cursor-pointer" onClick={() => router.push(`/todo-list/${id}`)}>
											{createdAt}
										</th>
										<th className="flex justify-end">
											<button className="btn btn-error" onClick={() => deleteTodo(id)}>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													fill="white"
													className="bi bi-trash-fill"
													viewBox="0 0 16 16"
												>
													<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
												</svg>
											</button>
										</th>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<dialog id="my_modal" className="modal">
					<div className="modal-box">
						<form method="dialog">
							<button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
						</form>
						<h3 className="font-bold text-lg mb-3">New todo list</h3>
						<form onSubmit={handleSubmit(onSubmit)}>
							<input
								{...register("title", { required: true })}
								className={"input input-bordered w-full" + (errors.title ? " border-error" : "")}
								type="text"
								placeholder="Title"
							/>
							<div className="modal-action">
								<button
									type="submit"
									className="btn"
									onClick={() =>
										errors.title ? () => {} : () => (document.getElementById("my_modal") as HTMLDialogElement)?.close()
									}
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
