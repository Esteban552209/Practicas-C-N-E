import 'package:flutter/material.dart';
import '../services/api_service.dart';

class EquiposView extends StatefulWidget {
  const EquiposView({super.key});

  @override
  State<EquiposView> createState() => _EquiposViewState();
}

class _EquiposViewState extends State<EquiposView> {
  void _mostrarDetalleEquipo(Map<String, dynamic> equipo) {
    final TextEditingController _observacionController =
        TextEditingController();
    bool _isSubmitting = false;
    final bool estaOperativo = equipo['estado'];

    showModalBottomSheet(
      context: context,
      isScrollControlled:
          true,
      backgroundColor: const Color(0xFF1E1E1E),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
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
                        equipo['codigo'],
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
                              ? Colors.green.withOpacity(0.2)
                              : Colors.red.withOpacity(0.2),
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
                        equipo['observacion'] ?? 'Sin detalles adicionales',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),
                  ]
                  else ...[
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
                        contentPadding: const EdgeInsets.all(16),
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
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        onPressed: _isSubmitting
                            ? null
                            : () async {
                                if (_observacionController.text
                                    .trim()
                                    .isEmpty) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text(
                                        'Por favor ingrese una observación',
                                      ),
                                    ),
                                  );
                                  return;
                                }
                                setModalState(() => _isSubmitting = true);
                                try {
                                  await ApiService.reportarFalla(
                                    equipo['id'],
                                    _observacionController.text,
                                  );
                                  if (context.mounted) {
                                    Navigator.pop(context);
                                    _cargarEquipos(
                                      _selectedSalonId!,
                                    );
                                  }
                                } catch (e) {
                                  setModalState(() => _isSubmitting = false);
                                  if (context.mounted) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text(
                                          'Error al procesar el reporte',
                                        ),
                                      ),
                                    );
                                  }
                                }
                              },
                        child: _isSubmitting
                            ? const SizedBox(
                                height: 24,
                                width: 24,
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                              )
                            : const Text(
                                'ENVIAR REPORTE',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                ),
                              ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],
                ],
              ),
            );
          },
        );
      },
    );
  }

  List<dynamic> _salones = [];
  String? _selectedSalonId;

  List<dynamic> _equipos = [];
  bool _isLoadingSalones = true;
  bool _isLoadingEquipos = false;

  @override
  void initState() {
    super.initState();
    _cargarSalonesIniciales();
  }

  Future<void> _cargarSalonesIniciales() async {
    try {
      final salones = await ApiService.getSalones();
      if (salones.isNotEmpty) {
        setState(() {
          _salones = salones;
          _selectedSalonId = salones[0]['id'];
          _isLoadingSalones = false;
        });
        _cargarEquipos(_selectedSalonId!);
      } else {
        setState(() {
          _isLoadingSalones = false;
        });
      }
    } catch (e) {
      setState(() {
        _isLoadingSalones = false;
      });
      debugPrint("Error al cargar salones: $e");
    }
  }

  Future<void> _cargarEquipos(String salonId) async {
    setState(() {
      _isLoadingEquipos = true;
    });
    try {
      final equipos = await ApiService.getEquipos(salonId);
      setState(() {
        _equipos = equipos;
        _isLoadingEquipos = false;
      });
    } catch (e) {
      setState(() {
        _isLoadingEquipos = false;
      });
      debugPrint("Error al cargar equipos: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Gestión de Equipos',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 16.0,
              vertical: 8.0,
            ),
            child: Container(
              constraints: const BoxConstraints(minHeight: 48),
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              decoration: BoxDecoration(
                color: const Color(0xFF1E1E1E),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.cyan.withOpacity(0.3)),
              ),
              child: _isLoadingSalones
                  ? const Center(
                      child: CircularProgressIndicator(color: Colors.cyan),
                    )
                  : DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _selectedSalonId,
                        isExpanded: true,
                        icon: const Icon(
                          Icons.keyboard_arrow_down,
                          color: Colors.cyan,
                        ),
                        dropdownColor: const Color(0xFF1E1E1E),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                        hint: const Text(
                          "Seleccionar Salón",
                          style: TextStyle(color: Colors.grey),
                        ),
                        items: _salones.map((salon) {
                          return DropdownMenuItem<String>(
                            value: salon['id'],
                            child: Text(salon['nombre']),
                          );
                        }).toList(),
                        onChanged: (nuevoId) {
                          if (nuevoId != null && nuevoId != _selectedSalonId) {
                            setState(() {
                              _selectedSalonId = nuevoId;
                            });
                            _cargarEquipos(nuevoId);
                          }
                        },
                      ),
                    ),
            ),
          ),

          Expanded(
            child: _isLoadingEquipos
                ? const Center(
                    child: CircularProgressIndicator(color: Colors.cyan),
                  )
                : _equipos.isEmpty
                ? const Center(
                    child: Text(
                      "No hay equipos en este salón",
                      style: TextStyle(color: Colors.grey),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _equipos.length,
                    itemBuilder: (context, index) {
                      final equipo = _equipos[index];
                      final bool estaOperativo = equipo['estado'];

                      final colorEstado = estaOperativo
                          ? Colors.greenAccent
                          : Colors.redAccent;

                      return Card(
                        color: const Color(0xFF1E1E1E),
                        elevation: 0,
                        margin: const EdgeInsets.only(bottom: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          side: BorderSide(
                            color: colorEstado.withOpacity(0.5),
                            width: 1,
                          ),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 4,
                          ),
                          leading: Container(
                            width: 12,
                            height: 12,
                            decoration: BoxDecoration(
                              color: colorEstado,
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: colorEstado.withOpacity(0.5),
                                  blurRadius: 6,
                                  spreadRadius: 2,
                                ),
                              ],
                            ),
                          ),
                          title: Text(
                            equipo['codigo'],
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          subtitle: Text(
                            estaOperativo ? 'Operativo' : 'Falla reportada',
                            style: TextStyle(
                              color: estaOperativo
                                  ? Colors.grey
                                  : Colors.redAccent.shade100,
                            ),
                          ),
                          trailing: const Icon(
                            Icons.chevron_right,
                            color: Colors.cyan,
                          ),
                          onTap: () {_mostrarDetalleEquipo(equipo);},
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: Colors.cyan,
        onPressed: () {},
        icon: const Icon(Icons.add, color: Colors.black),
        label: const Text(
          'Nuevo Equipo',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
