import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../widgets/modal_crear_equipo.dart';
import '../widgets/modal_detalle_equipo.dart';

class EquiposView extends StatefulWidget {
  final String? salonIdPreseleccionado;
  const EquiposView({super.key, this.salonIdPreseleccionado});

  @override
  State<EquiposView> createState() => _EquiposViewState();
}

class _EquiposViewState extends State<EquiposView> {
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
          _selectedSalonId = widget.salonIdPreseleccionado ?? salones[0]['id'];
          _isLoadingSalones = false;
        });
        _cargarEquipos(_selectedSalonId!);
      } else {
        setState(() => _isLoadingSalones = false);
      }
    } catch (e) {
      setState(() => _isLoadingSalones = false);
    }
  }

  Future<void> _cargarEquipos(String salonId) async {
    setState(() => _isLoadingEquipos = true);
    try {
      final equipos = await ApiService.getEquipos(salonId);
      setState(() {
        _equipos = equipos;
        _isLoadingEquipos = false;
      });
    } catch (e) {
      setState(() => _isLoadingEquipos = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Gestión de Equipos', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Container(
              constraints: const BoxConstraints(minHeight: 48),
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              decoration: BoxDecoration(
                color: const Color(0xFF1E1E1E),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.cyan.withValues(alpha: 0.3)),
              ),
              child: _isLoadingSalones
                  ? const Center(child: CircularProgressIndicator(color: Colors.cyan))
                  : DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _selectedSalonId,
                        isExpanded: true,
                        icon: const Icon(Icons.keyboard_arrow_down, color: Colors.cyan),
                        dropdownColor: const Color(0xFF1E1E1E),
                        style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600),
                        hint: const Text("Seleccionar Salón", style: TextStyle(color: Colors.grey)),
                        items: _salones.map((salon) {
                          return DropdownMenuItem<String>(
                            value: salon['id'],
                            child: Text(salon['nombre']),
                          );
                        }).toList(),
                        onChanged: (nuevoId) {
                          if (nuevoId != null && nuevoId != _selectedSalonId) {
                            setState(() => _selectedSalonId = nuevoId);
                            _cargarEquipos(nuevoId);
                          }
                        },
                      ),
                    ),
            ),
          ),
          Expanded(
            child: _isLoadingEquipos
                ? const Center(child: CircularProgressIndicator(color: Colors.cyan))
                : _equipos.isEmpty
                ? const Center(child: Text("No hay equipos en este salón", style: TextStyle(color: Colors.grey)))
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _equipos.length,
                    itemBuilder: (context, index) {
                      final equipo = _equipos[index];
                      final bool estaOperativo = equipo['estado'];
                      final colorEstado = estaOperativo ? Colors.greenAccent : Colors.redAccent;

                      return Card(
                        color: const Color(0xFF1E1E1E),
                        elevation: 0,
                        margin: const EdgeInsets.only(bottom: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          side: BorderSide(color: colorEstado.withValues(alpha: 0.3), width: 1),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                          leading: Container(
                            width: 12, height: 12,
                            decoration: BoxDecoration(
                              color: colorEstado, shape: BoxShape.circle,
                              boxShadow: [BoxShadow(color: colorEstado.withValues(alpha: 0.3), blurRadius: 6, spreadRadius: 2)],
                            ),
                          ),
                          title: Text(equipo['codigo'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          subtitle: Text(
                            estaOperativo ? 'Operativo' : 'Falla reportada',
                            style: TextStyle(color: estaOperativo ? Colors.grey : Colors.redAccent.shade100),
                          ),
                          trailing: const Icon(Icons.chevron_right, color: Colors.cyan),
                          onTap: () {
                            showModalBottomSheet(
                              context: context,
                              isScrollControlled: true,
                              backgroundColor: Colors.transparent,
                              builder: (context) => ModalDetalleEquipo(
                                equipo: equipo,
                                onReportado: () {
                                  Navigator.pop(context);
                                  _cargarEquipos(_selectedSalonId!);
                                },
                              ),
                            );
                          },
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: Colors.cyan,
        onPressed: () {
          if (_selectedSalonId == null) {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Debe seleccionar un salón primero')));
            return;
          }
          showModalBottomSheet(
            context: context,
            isScrollControlled: true,
            backgroundColor: Colors.transparent,
            builder: (context) => ModalCrearEquipo(
              salonId: _selectedSalonId!,
              onGuardado: () {
                Navigator.pop(context);
                _cargarEquipos(_selectedSalonId!);
              },
            ),
          );
        },
        icon: const Icon(Icons.add, color: Colors.black),
        label: const Text('Nuevo Equipo', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
      ),
    );
  }
}