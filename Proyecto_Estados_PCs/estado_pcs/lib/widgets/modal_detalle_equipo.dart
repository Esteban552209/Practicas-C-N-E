import 'package:flutter/material.dart';

import '../services/api_service.dart';

class ModalDetalleEquipo extends StatefulWidget {
  final Map<String, dynamic> equipo;
  final VoidCallback onReportado;

  const ModalDetalleEquipo({
    super.key,
    required this.equipo,
    required this.onReportado,
  });

  @override
  State<ModalDetalleEquipo> createState() => _ModalDetalleEquipoState();
}

class _ModalDetalleEquipoState extends State<ModalDetalleEquipo> {
  final TextEditingController _observacionController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _observacionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bool estaOperativo = widget.equipo['estado'];

    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF1E1E1E),
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
        left: 24,
        right: 24,
        top: 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                widget.equipo['codigo'],
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: estaOperativo
                      ? Colors.green.withValues(alpha: 0.2)
                      : Colors.red.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  estaOperativo ? 'Operativo' : 'Falla Reportada',
                  style: TextStyle(
                    color: estaOperativo
                        ? Colors.greenAccent
                        : Colors.redAccent,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          if (!estaOperativo) ...[
            const Text(
              'Detalle del reporte:',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF2A2A2A),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                widget.equipo['observacion'] ?? 'Sin detalles',
                style: const TextStyle(color: Colors.white, fontSize: 16),
              ),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.greenAccent,
                  foregroundColor: Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                icon: _isSubmitting
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          color: Colors.black,
                          strokeWidth: 2,
                        ),
                      )
                    : const Icon(Icons.build),
                label: Text(
                  _isSubmitting ? 'PROCESANDO...' : 'MARCAR COMO REPARADO',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                onPressed: _isSubmitting
                    ? null
                    : () async {
                        setState(() => _isSubmitting = true);
                        try {
                          await ApiService.repararEquipo(widget.equipo['id']);
                          widget.onReportado();
                        } catch (e) {
                          setState(() => _isSubmitting = false);
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Error al reparar el equipo'),
                              ),
                            );
                          }
                        }
                      },
              ),
            ),
            const SizedBox(height: 16),
          ] else ...[
            const Text(
              'Describa la novedad del equipo:',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _observacionController,
              maxLines: 3,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Ej: El monitor enciende pero no da video...',
                hintStyle: const TextStyle(color: Colors.grey),
                filled: true,
                fillColor: const Color(0xFF2A2A2A),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Colors.cyan),
                ),
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.redAccent,
                  foregroundColor: Colors.white,
                ),
                onPressed: _isSubmitting
                    ? null
                    : () async {
                        if (_observacionController.text.trim().isEmpty) return;

                        setState(() => _isSubmitting = true);
                        try {
                          await ApiService.reportarFalla(
                            widget.equipo['id'],
                            _observacionController.text,
                          );
                          widget.onReportado();
                        } catch (e) {
                          setState(() => _isSubmitting = false);
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Error al procesar el reporte'),
                              ),
                            );
                          }
                        }
                      },
                child: _isSubmitting
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                        'ENVIAR REPORTE',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
