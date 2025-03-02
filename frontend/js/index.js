document.addEventListener("DOMContentLoaded", () => {
	// Date Display
	const dateElement = document.querySelector(".current-date");
	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	dateElement.textContent = new Date().toLocaleDateString("en-US", options);

	// DOM Elements
	const submitBtn = document.querySelector(".submit-btn");
	const newTaskInput = document.querySelector(".new-task");
	const todoList = document.querySelector(".todo-items");

	// Load and Display Todos
	const displayTodos = (todos) => {
		todoList.innerHTML = todos
			.map(
				(todo) => `
            <li data-id="${todo._id}">
                <span class="task">${todo.text}</span>
                <div class="buttons">
                    <button class="update-btn">Update</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </li>
        `
			)
			.join("");
	};

	// Fetch Todos
	const loadTodos = async () => {
		try {
			const response = await fetch("http://localhost:3000/todos");
			const todos = await response.json();
			displayTodos(todos);
		} catch (err) {
			console.error("Error loading todos:", err);
		}
	};

	// Delete Todo
	todoList.addEventListener("click", async (e) => {
		if (e.target.classList.contains("delete-btn")) {
			const li = e.target.closest("li");
			try {
				await fetch(`http://localhost:3000/todos/${li.dataset.id}`, {
					method: "DELETE",
				});
				loadTodos();
			} catch (err) {
				console.error("Delete error:", err);
			}
		}
	});

	// Update Todo
	todoList.addEventListener("click", async (e) => {
		if (e.target.classList.contains("update-btn")) {
			const button = e.target;
			const li = button.closest("li");
			const taskElement = li.querySelector(".task");

			if (button.textContent === "Update") {
				const input = document.createElement("input");
				input.type = "text";
				input.value = taskElement.textContent;
				taskElement.replaceWith(input);
				button.textContent = "Save";
			} else {
				const input = li.querySelector("input");
				try {
					await fetch(`http://localhost:3000/todos/${li.dataset.id}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ text: input.value }),
					});
					loadTodos();
				} catch (err) {
					console.error("Update error:", err);
				}
			}
		}
	});

	// Add Todo
	submitBtn.addEventListener("click", async () => {
		const taskText = newTaskInput.value.trim();
		if (!taskText) return;

		try {
			await fetch("http://localhost:3000/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: taskText }),
			});
			newTaskInput.value = "";
			loadTodos();
		} catch (err) {
			console.error("Add error:", err);
		}
	});

	// Initial Load
	loadTodos();
});
