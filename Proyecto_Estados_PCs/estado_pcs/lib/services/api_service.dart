import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://192.168.1.6:3000';

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

  // Enviar reporte de falla (estado: false)
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
}

