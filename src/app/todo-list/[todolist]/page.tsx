"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getItem } from "@/app/components/functions";

type FormValues = {
	createdAt: string;
	title: string;
	deadline: string;
	description: string;
	state: string;
};

export default function Todolist({ params }: { params: { todolist: string } }) {
	const router = useRouter();
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<FormValues>();
	const [todoItems, setTodoItems] = useState<any[]>([]); // Add type annotation for todos
	const [tmpTodoItems, setTmpTodoItems] = useState<any[]>([]); // Add type annotation for todos
	const [loading, setLoading] = useState<boolean>(true);

	const url = `https://6653697c1c6af63f4674a111.mockapi.io/api/users/${getItem("user")}/todoLists/${params.todolist}`;

	const fetchTodoItems = () => {
		fetch(`${url}/todoItems`)
			.then((response) => response.json())
			.then((responseData) => {
				for (let i = 0; i < responseData.length; i++) {
					if (responseData[i].state === "0" && new Date(responseData[i].deadline).getTime() < new Date().getTime()) {
						doneTodo(responseData[i].id, "2");
					}
				}
				setTodoItems(responseData);
				setTmpTodoItems(responseData);
				setLoading(false);
			})
			.catch((error) => console.error(error));
	};

	const logout = () => {
		if (global?.window !== undefined) {
			localStorage.removeItem("user");
		}
		setLoading(true);
		router.push("/login");
	};

	const onSubmit = (data: FormValues) => {
		const date = new Date();
		data.createdAt = date.toLocaleString();
		data.state = "0";

		fetch(`${url}/todoItems`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then(() => setLoading(true))
			.catch((error) => console.error(error));
	};

	const doneTodo = (id: number, state: string) => {
		fetch(`${url}/todoItems/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ state: state }),
		})
			.then((response) => response.json())
			.then(() => setLoading(true))
			.catch((error) => console.error(error));
	};

	const deleteTodo = (id: number) => {
		fetch(`${url}/todoItems/${id}`, {
			method: "DELETE",
		})
			.then((response) => response.json())
			.then(() => setLoading(true))
			.catch((error) => console.error(error));
	};

	const showAll = () => {
		setTmpTodoItems(todoItems);
	};

	const showActive = () => {
		setTmpTodoItems(todoItems.filter((item) => item.state === "0"));
	};

	const showCompleted = () => {
		setTmpTodoItems(todoItems.filter((item) => item.state === "1"));
	};

	const showExpired = () => {
		setTmpTodoItems(todoItems.filter((item) => item.state === "2"));
	};
	useEffect(() => {
		getItem("user");
		if (!getItem("user")) {
			router.push("/login");
		}
		fetchTodoItems();
	}, [loading]);

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
							<li>
								<Link href="#">Todo list {params.todolist}</Link>
							</li>
						</ul>
					</div>
					<h1 className="w-full text-center text-4xl">Todo List</h1>
					<div className="flex justify-end w-full">
						<button className="btn btn-primary" onClick={() => logout()}>
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
				<div className="flex flex-col">
					<div className="overflow-x-auto">
						<form onSubmit={handleSubmit(onSubmit)} className="mt-2">
							<table className="table">
								<thead>
									<tr>
										<th></th>
										<th>Name</th>
										<th>Description</th>
										<th>State</th>
										<th>
											<input
												className="input"
												type="text"
												placeholder="Search title"
												onChange={(e) => {
													const searchValue = e.target.value.toLowerCase();
													const filteredItems = todoItems.filter((item) =>
														item.title.toLowerCase().includes(searchValue)
													);
													setTmpTodoItems(filteredItems);
												}}
											/>
											<select
												className="select select-bordered"
												onChange={(selectedOption) => {
													if (selectedOption.target.value === "Show all") {
														showAll();
													} else if (selectedOption.target.value === "Active") {
														showActive();
													} else if (selectedOption.target.value === "Completed") {
														showCompleted();
													} else {
														showExpired();
													}
												}}
											>
												<option selected>Show all</option>
												<option>Active</option>
												<option>Completed</option>
												<option>Expired</option>
											</select>
										</th>
									</tr>
								</thead>
								<tbody>
									<tr className={"bg-base-300 hover"}>
										<th></th>
										<th>
											<input
												{...register("title", { required: true })}
												className={"input w-full" + (errors.title ? " border-error" : "")}
												type="text"
												placeholder="Title"
											/>
										</th>
										<th>
											<input
												{...register("description")}
												className="input w-full"
												type="text"
												placeholder="Description"
											/>
										</th>
										<th>
											<input
												{...register("deadline", { required: true })}
												className={"input w-full" + (errors.deadline ? " border-error" : "")}
												type="datetime-local"
												placeholder="Deadline"
											/>
										</th>
										<th className="flex justify-end">
											<button type="submit" className="btn btn-primary">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													fill="white"
													className="bi bi-plus-circle-fill"
													viewBox="0 0 16 16"
												>
													<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
												</svg>
											</button>
										</th>
									</tr>
									{tmpTodoItems.map(({ id, title, description, deadline, state }) => (
										<tr className="bg-base-300 hover" key={"key" + id}>
											<th>
												<button
													id="doneBtn"
													className={
														"btn" +
														(state === "0" ? " btn-outline btn-success" : "") +
														(state === "1" ? " btn-success" : "") +
														(state === "2" ? " btn-warning" : "")
													}
													onClick={
														Number(new Date(deadline).getTime()) < Number(new Date().getTime())
															? () => {
																	const alertElement = document.getElementById("alert");
																	if (alertElement) {
																		alertElement.classList.remove("opacity-0");
																		alertElement.classList.add("z-50");
																		alertElement.classList.add("opacity-100");
																		setTimeout(() => alertElement.classList.remove("opacity-100"), 2000);
																		setTimeout(() => alertElement.classList.add("-z-50"), 2000);
																		setTimeout(() => alertElement.classList.add("opacity-0"), 2000);
																	}
															  }
															: () => doneTodo(id, state === "0" ? "1" : "0")
													}
												>
													{state === "0" ? (
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															fill="#00a96e"
															className="bi bi-check-circle"
															viewBox="0 0 16 16"
														>
															<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
															<path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
														</svg>
													) : state === "1" ? (
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															fill="white"
															className="bi bi-check-circle-fill"
															viewBox="0 0 16 16"
														>
															<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
														</svg>
													) : (
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															fill="white"
															className="bi bi-x-circle-fill"
															viewBox="0 0 16 16"
														>
															<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
														</svg>
													)}
												</button>
											</th>
											<th>{title}</th>
											<th>{description}</th>
											<th>{state === "0" ? deadline : state === "1" ? "Completed" : "Expired"}</th>
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
						</form>
					</div>
				</div>
				<div
					role="alert"
					id="alert"
					className="-z-50 opacity-0 w-auto alert alert-warning absolute top-2.5 left-2.5 duration-500 transition-opacity"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="stroke-current shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
					<span>Warning: Deadline is passed!</span>
				</div>
			</main>
		);
	}
}
