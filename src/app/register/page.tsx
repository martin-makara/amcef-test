"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { getWithExpiry } from "../components/functions";

type Inputs = {
	createdAt: string;
	name: string;
	mail: string;
	password: string;
};

export default function Register() {
	const router = useRouter();
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<Inputs>();

	const date = new Date();
	const getUserUrl = new URL("https://6653697c1c6af63f4674a111.mockapi.io/api/users");

	const registerUser = (data: Inputs) => {
		fetch("https://6653697c1c6af63f4674a111.mockapi.io/api/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.catch((error) => console.error(error))
			.finally(() => {
				alert("You have successfully registered!");
				router.push("/login");
			});
	};

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		data.createdAt = date.toLocaleString();
		getUserUrl.searchParams.set("mail", data.mail);

		fetch(getUserUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((response: any) => {
				if (response.status === 404 || response.length === 0) {
					registerUser(data);
				} else if (response.status === 200 || response.length > 0) {
					alert("This email is already registered!");
				}
			})
			.catch((error) => console.error(error));
	};

	useEffect(() => {
		getWithExpiry("user");
		if (getWithExpiry("user")) {
			router.push("/");
		}
	}, []);

	return (
		<div>
			<h1>Regsiter</h1>
			<Link href="/login">Login</Link>
			<form className="menu" onSubmit={handleSubmit(onSubmit)}>
				<label
					className="input input-bordered flex items-center gap-2"
					style={errors.mail ? { borderColor: "red" } : {}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						className="w-4 h-4 opacity-70"
					>
						<path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
						<path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
					</svg>
					<input
						type="text"
						className="grow"
						placeholder="Email"
						{...register("mail", {
							required: true,
							pattern:
								/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
						})}
					/>
				</label>
				<label
					className="input input-bordered flex items-center gap-2"
					style={errors.name ? { borderColor: "red" } : {}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						className="w-4 h-4 opacity-70"
					>
						<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
					</svg>
					<input
						type="text"
						className="grow"
						placeholder="Username"
						{...register("name", { required: true, minLength: 3 })}
					/>
				</label>
				<label
					className="input input-bordered flex items-center gap-2"
					style={errors.password ? { borderColor: "red" } : {}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						className="w-4 h-4 opacity-70"
					>
						<path
							fillRule="evenodd"
							d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
							clipRule="evenodd"
						/>
					</svg>
					<input
						type="password"
						className="grow"
						placeholder="Password"
						{...register("password", { required: true, minLength: 8 })}
					/>
				</label>
				{(errors.mail || errors.name || errors.password) && <span>These fields is required!</span>}
				<input className="input" type="submit" />
			</form>
		</div>
	);
}
