#!/bin/bash

# Prompt the user for the project name
echo "Enter your project name:"
read project_name

# Create the Vite project using the project name
npm create vite@latest $project_name -- --template react

# Navigate into the new project directory
cd $project_name

# Install Tailwind CSS, PostCSS, and Autoprefixer
npm install -D tailwindcss postcss autoprefixer


# Initialize Tailwind configuration files
npx tailwindcss init -p


# Remove the default index.css
rm src/index.css

# Set up Tailwind in the new src/index.css
echo "@tailwind base;" >> src/index.css
echo "@tailwind components;" >> src/index.css
echo "@tailwind utilities;" >> src/index.css

# Remove the default Tailwind config
rm tailwind.config.js

# Create a new Tailwind config with DaisyUI
echo '/** @type {import("tailwindcss").Config} */
export default {
  content: [

    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}' >> tailwind.config.js

# Install DaisyUI
npm i -D daisyui@latest

# Remove the default App.css file
rm src/App.css

# Overwrite the App.jsx file with Tailwind CSS and DaisyUI example code
echo 'function App() {
  return (
    <div className="text-center text-2xl bg-yellow-200 font-bold text-blue-500">
      Welcome to Tailwind CSS with DaisyUI!
    </div>

  );
}

export default App;' > src/App.jsx

# Final message
echo "Project $project_name has been created and configured with Tailwind CSS, DaisyUI, and example Tailwind styles."

# Install dependencies and start the dev server
npm install
npm run dev#!/bin/bash

# Prompt the user for the project name
echo "Enter your project name:"
read project_name

# Create the Vite project using the project name
npm create vite@latest $project_name -- --template react

# Navigate into the new project directory
cd $project_name

# Install Tailwind CSS, PostCSS, and Autoprefixer
npm install -D tailwindcss postcss autoprefixer


# Initialize Tailwind configuration files
npx tailwindcss init -p


# Remove the default index.css
rm src/index.css

# Set up Tailwind in the new src/index.css
echo "@tailwind base;" >> src/index.css
echo "@tailwind components;" >> src/index.css
echo "@tailwind utilities;" >> src/index.css

# Remove the default Tailwind config
rm tailwind.config.js

# Create a new Tailwind config with DaisyUI
echo '/** @type {import("tailwindcss").Config} */
export default {
  content: [

    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}' >> tailwind.config.js

# Install DaisyUI
npm i -D daisyui@latest

# Remove the default App.css file
rm src/App.css

# Overwrite the App.jsx file with Tailwind CSS and DaisyUI example code
echo 'function App() {
  return (
    <div className="text-center text-2xl bg-yellow-200 font-bold text-blue-500">
      Welcome to Tailwind CSS with DaisyUI!
    </div>

  );
}

export default App;' > src/App.jsx

# Final message
echo "Project $project_name has been created and configured with Tailwind CSS, DaisyUI, and example Tailwind styles."

# Install dependencies and start the dev server
npm install
npm run dev