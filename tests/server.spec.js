import request from "supertest";
import {app} from "../index.js";

describe("Operaciones CRUD de Proyecto", () => {
    
    test("Obteniendo productos - status 200", async () => {
        const response = await request(app).get("/tienda");
        expect(response.status).toBe(200);
    }); 
    
    test("Obteniendo mis publicaciones Validado por Token - status 200", async () => {
        const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3JyZW8iOiJqb2huMkBtYWlsLmNvbSIsImlhdCI6MTY4OTk4Mzg5M30.u53JGaDeWfRPicNG87LJGcDnbM7of2vCaeTxY-fFrW4';
        const response = await request(app)
        .get("/dashboard/mis-publicaciones")
        .set('Authorization', `Bearer ${validToken}`);
        expect(response.status).toBe(200);
    }); 

    test("Crear un usuario  - status 201", async () => {
        const userData = {
            correo: 'Juan',
            contrasena: 'juan@example.com',
          };
      const response = await request(app)
      .post('/registro')
      .send(userData);
      expect(response.status).toBe(201);

    });

    test("Error credenciales incorrectas - status 500", async () => {
        const userData = {
            correo: 'francisco@lfi.com',
            contrasena: '123123',
          };
      const response = await request(app)
      .post('/ingresar')
      .send(userData);
       expect(response.status).toBe(500);
    });

}); 