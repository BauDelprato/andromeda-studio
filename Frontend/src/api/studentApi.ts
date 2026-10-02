export const createStudent = async (studentData: any) => {
  // Asegúrate de que el puerto (7137) coincida con el que te abre Visual Studio al correr el backend
  const response = await fetch("https://localhost:7137/api/Students", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) {
    const errorMsg = await response.text();
    throw new Error(errorMsg || "Error al crear el estudiante");
  }

  return await response.json();
};