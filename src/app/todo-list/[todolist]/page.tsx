"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { getWithExpiry } from "@/app/components/functions";

type FormValues = {
	createAt: string;
	title: string;
	deadline: string;
	description: string;
	state: string;
};

export default function Todolist({ params }: { params: { todolist: string } }) {
	const router = useRouter();
	const { register, handleSubmit } = useForm<FormValues>();
	const [todoItems, setTodoItems] = useState<any[]>([]); // Add type annotation for todos
	const [loading, setLoading] = useState<boolean>(true);

	const onSubmit = (data: FormValues) => {
		const date = new Date();
		data.createAt = date.toLocaleString();
		data.state = "1";

		fetch(
			`https://6653697c1c6af63f4674a111.mockapi.io/api/users/${getWithExpiry("user")}/todoLists/${
				params.todolist
			}/todoItems`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}
		)
			.then((response) => response.json())
			.then(() => setLoading(true))
			.catch((error) => console.error(error));
	};

	const doneTodo = (id: number, state: string) => {
		state === "0"
			? document.getElementById("doneBtn")?.classList.remove("btn-outline")
			: document.getElementById("doneBtn")?.classList.add("btn-outline");
		fetch(
			`https://6653697c1c6af63f4674a111.mockapi.io/api/users/${getWithExpiry("user")}/todoLists/${
				params.todolist
			}/todoItems/${id}`,
			{
				method: "PUT",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ state: state }),
			}
		)
			.then((response) => response.json())
			.then(() => setLoading(true))
			.catch((error) => console.error(error));
	};

	const deleteTodo = (id: number) => {
		fetch(
			`https://6653697c1c6af63f4674a111.mockapi.io/api/users/${getWithExpiry("user")}/todoLists/${
				params.todolist
			}/todoItems/${id}`,
			{
				method: "DELETE",
			}
		)
			.then((response) => response.json())
			.then(() => setLoading(true))
			.catch((error) => console.error(error));
	};

	useEffect(() => {
		getWithExpiry("user");
		if (!getWithExpiry("user")) {
			router.push("/login");
		}
		fetch(
			`https://6653697c1c6af63f4674a111.mockapi.io/api/users/${getWithExpiry("user")}/todoLists/${
				params.todolist
			}/todoItems`
		)
			.then((response) => response.json())
			.then((responseData) => {
				for (let i = 0; i < responseData.length; i++) {
					if (responseData[i].state === "1" && new Date(responseData[i].deadline).getTime() < new Date().getTime()) {
						doneTodo(responseData[i].id, "0");
					}
				}
				setTodoItems(responseData);
				setLoading(false);
			})
			.catch((error) => console.error(error));
	}, [todoItems, loading]);

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
				</div>
				<div className="text-sm breadcrumbs">
					<ul>
						<li>
							<Link href="/">Home</Link>
						</li>
						<li>
							<Link href="#">Todo list {params.todolist}</Link>
						</li>
					</ul>
				</div>
				<div className="flex flex-col">
					{todoItems.map(({ id, todoListId, createdAt, title, description, deadline, state }) => (
						<div
							className="flex justify-between w-full"
							key={"key" + id}
							style={state == 0 ? { backgroundColor: "gray" } : {}}
						>
							<button
								id="doneBtn"
								className="btn btn-outline btn-primary"
								onClick={
									new Date(deadline).getTime() < new Date().getTime()
										? () => alert("Deadline is passed")
										: () => doneTodo(id, state === "0" ? "1" : "0")
								}
							>
								{state === "0" ? (
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
										fill="#7480ff"
										className="bi bi-check-circle"
										viewBox="0 0 16 16"
									>
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
										<path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
									</svg>
								)}
							</button>
							{/* <p>{todoListId}</p> */}
							<p>{title}</p>
							<p>{description}</p>
							<p>{createdAt}</p>
							<p>{state === "1" ? deadline : "Completed"}</p>
							<p>{}</p>
							<button className="btn btn-error" onClick={() => deleteTodo(id)}>
								Delete
							</button>
						</div>
					))}
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="flex">
							<input {...register("title")} className="input input-bordered w-full" type="text" placeholder="Title" />
							<input
								{...register("description")}
								className="input input-bordered w-full"
								type="text"
								placeholder="Description"
							/>
							<input
								{...register("deadline")}
								className="input input-bordered w-full"
								type="datetime-local"
								placeholder="Deadline"
							/>
						</div>
						<div className="modal-action">
							<button type="submit" className="btn">
								Add
							</button>
						</div>
					</form>
				</div>
			</main>
		);
	}
}
