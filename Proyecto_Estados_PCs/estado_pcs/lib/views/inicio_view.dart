import 'package:flutter/material.dart';

import '../services/api_service.dart';
import 'historial_view.dart';

class InicioView extends StatefulWidget {
  const InicioView({super.key});

  @override
  State<InicioView> createState() => _InicioViewState();
}

class _InicioViewState extends State<InicioView> {
  Map<String, dynamic>? _estadisticas;
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _cargarDashboard();
  }

  Future<void> _cargarDashboard() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final data = await ApiService.getEstadisticas();
      setState(() {
        _estadisticas = data;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Widget _buildStatCard(
    String titulo,
    String valor,
    IconData icono,
    Color colorAcento,
  ) {
    return Card(
      color: const Color(0xFF1E1E1E),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: colorAcento.withValues(alpha: 0.3), width: 1),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: colorAcento.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icono, color: colorAcento, size: 28),
            ),
            const Spacer(),
            Text(
              valor,
              style: const TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              titulo,
              style: const TextStyle(
                fontSize: 14,
                color: Colors.grey,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Dashboard',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.cyan),
            onPressed: _cargarDashboard,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Colors.cyan))
          : _error != null
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.error_outline,
                    color: Colors.redAccent,
                    size: 48,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Error al cargar datos',
                    style: TextStyle(color: Colors.redAccent.shade100),
                  ),
                  ElevatedButton(
                    onPressed: _cargarDashboard,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.cyan,
                    ),
                    child: const Text(
                      'Reintentar',
                      style: TextStyle(color: Colors.black),
                    ),
                  ),
                ],
              ),
            )
          : RefreshIndicator(
              color: Colors.cyan,
              backgroundColor: const Color(0xFF1E1E1E),
              onRefresh: _cargarDashboard,
              child: ListView(
                padding: const EdgeInsets.all(16.0),
                children: [
                  const Text(
                    'Resumen General',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Grid de Estadísticas
                  GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 0.85,
                    children: [
                      _buildStatCard(
                        'Salones',
                        _estadisticas!['total_salones'].toString(),
                        Icons.meeting_room,
                        Colors.cyan,
                      ),
                      _buildStatCard(
                        'Total Equipos',
                        _estadisticas!['total_equipos'].toString(),
                        Icons.computer,
                        Colors.cyan,
                      ),
                      _buildStatCard(
                        'Operativos',
                        _estadisticas!['equipos_operativos'].toString(),
                        Icons.check_circle_outline,
                        Colors.greenAccent,
                      ),
                      _buildStatCard(
                        'En Falla',
                        _estadisticas!['equipos_falla'].toString(),
                        Icons.warning_amber_rounded,
                        Colors.redAccent,
                      ),
                    ],
                  ),

                  const SizedBox(height: 32),

                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2A2A2A),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: const BorderSide(color: Colors.cyan, width: 1),
                        ),
                      ),
                      icon: const Icon(Icons.history, color: Colors.cyan),
                      label: const Text(
                        'Ver Historial de Reportes',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const HistorialView(),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
