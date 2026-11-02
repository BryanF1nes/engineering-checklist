import "./styles.css";

const button = document.querySelector("button");
button.addEventListener("click", () => {
    document.body.classList.toggle("light");
})
