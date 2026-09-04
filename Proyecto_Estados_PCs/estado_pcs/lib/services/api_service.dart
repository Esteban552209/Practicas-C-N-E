import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://192.168.137.1:3000'; // IPv4 Del computador

  // Obtener lista de salones
  static Future<List<dynamic>> getSalones() async {
    final response = await http.get(Uri.parse('$baseUrl/salones'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Error al cargar los salones');
    }
  }

  // Obtener equipos de un salón específico
  static Future<List<dynamic>> getEquipos(String salonId) async {
    final response = await http.get(Uri.parse('$baseUrl/equipos/$salonId'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Error al cargar los equipos');
    }
  }

  // Enviar reporte de falla
  static Future<void> reportarFalla(String equipoId, String observacion) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/equipos/$equipoId/reportar'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'estado': false,
        'observacion': observacion,
      }),
    );
    if (response.statusCode != 200) {
      throw Exception('Error al actualizar el estado del equipo');
    }
  }

  // Crear un nuevo equipo
  static Future<void> crearEquipo(String codigo, String salonId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/equipos'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'codigo': codigo,
        'salon_id': salonId,
      }),
    );
    
    if (response.statusCode != 201) {
      throw Exception('Error al crear el equipo');
    }
  }

  // Crear un nuevo salón
  static Future<void> crearSalon(String nombre) async {
    final response = await http.post(
      Uri.parse('$baseUrl/salones'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'nombre': nombre,
      }),
    );
    
    if (response.statusCode != 201) {
      throw Exception('Error al crear el salón');
    }
  }

  // Editar salón
  static Future<void> editarSalon(String id, String nuevoNombre) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/salones/$id'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'nombre': nuevoNombre}),
    );
    if (response.statusCode != 200) throw Exception('Error al editar el salón');
  }

  // Eliminar salón
  static Future<void> eliminarSalon(String id) async {
    final response = await http.delete(Uri.parse('$baseUrl/salones/$id'));
    if (response.statusCode != 204 && response.statusCode != 200) {
      throw Exception('Error al eliminar el salón');
    }
  }

  // Obtener estadísticas del dashboard
  static Future<Map<String, dynamic>> getEstadisticas() async {
    final response = await http.get(Uri.parse('$baseUrl/dashboard/estadisticas'));
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Error al cargar las estadísticas');
    }
  }

  // Reparar equipo
  static Future<void> repararEquipo(String equipoId) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/equipos/$equipoId/reparar'),
    );
    if (response.statusCode != 200) {
      throw Exception('Error al reparar el equipo');
    }
  }

  // Obtener historial de reportes
  static Future<List<dynamic>> getHistorial() async {
    final response = await http.get(Uri.parse('$baseUrl/historial'));
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Error al cargar el historial');
    }
  }
}

