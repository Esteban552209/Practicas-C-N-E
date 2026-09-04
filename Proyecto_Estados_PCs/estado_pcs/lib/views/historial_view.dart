import 'package:flutter/material.dart';
import '../services/api_service.dart';

class HistorialView extends StatefulWidget {
  const HistorialView({super.key});

  @override
  State<HistorialView> createState() => _HistorialViewState();
}

class _HistorialViewState extends State<HistorialView> {
  late Future<List<dynamic>> _futureHistorial;

  @override
  void initState() {
    super.initState();
    _futureHistorial = ApiService.getHistorial();
  }

  String _formatearFecha(String fechaIso) {
    final DateTime fecha = DateTime.parse(fechaIso).toLocal();
    return "${fecha.day}/${fecha.month}/${fecha.year} - ${fecha.hour}:${fecha.minute.toString().padLeft(2, '0')}";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Historial de Actividad', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: FutureBuilder<List<dynamic>>(
        future: _futureHistorial,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: Colors.cyan));
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}', style: const TextStyle(color: Colors.redAccent)));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No hay registros en el historial', style: TextStyle(color: Colors.grey)));
          }

          final historial = snapshot.data!;

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: historial.length,
            itemBuilder: (context, index) {
              final item = historial[index];
              final bool esReporte = item['accion'] == 'REPORTADO';
              final colorAcento = esReporte ? Colors.redAccent : Colors.greenAccent;
              final equipoInfo = item['equipos'];
              final codigoEquipo = equipoInfo != null ? equipoInfo['codigo'] : 'Equipo Eliminado';
              final salonNombre = equipoInfo != null && equipoInfo['salones'] != null 
                  ? equipoInfo['salones']['nombre'] 
                  : 'Salón Eliminado';

              return Card(
                color: const Color(0xFF1E1E1E),
                elevation: 0,
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(color: colorAcento.withValues(alpha: 0.3), width: 1),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: colorAcento.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              item['accion'],
                              style: TextStyle(color: colorAcento, fontWeight: FontWeight.bold, fontSize: 12),
                            ),
                          ),
                          Text(
                            _formatearFecha(item['fecha']),
                            style: const TextStyle(color: Colors.grey, fontSize: 12),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        "$codigoEquipo • $salonNombre",
                        style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item['observacion'] ?? 'Sin detalles adicionales',
                        style: TextStyle(color: Colors.grey.shade400, fontSize: 14),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}