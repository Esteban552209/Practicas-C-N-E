import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../views/equipos_view.dart';
import 'modal_editar_salon.dart';

class ModalOpcionesSalon extends StatelessWidget {
  final Map<String, dynamic> salon;
  final VoidCallback onAccionCompletada;

  const ModalOpcionesSalon({super.key, required this.salon, required this.onAccionCompletada});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF1E1E1E),
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.computer, color: Colors.cyan),
                title: const Text('Ver equipos', style: TextStyle(color: Colors.white)),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => EquiposView(salonIdPreseleccionado: salon['id']),
                    ),
                  );
                },
              ),
              
              ListTile(
                leading: const Icon(Icons.edit, color: Colors.cyan),
                title: const Text('Editar nombre', style: TextStyle(color: Colors.white)),
                onTap: () {
                  Navigator.pop(context);
                  showModalBottomSheet(
                    context: context,
                    isScrollControlled: true,
                    backgroundColor: Colors.transparent,
                    builder: (context) => ModalEditarSalon(
                      salon: salon,
                      onGuardado: () {
                        Navigator.pop(context);
                        onAccionCompletada();
                      },
                    ),
                  );
                },
              ),
              
              ListTile(
                leading: const Icon(Icons.delete, color: Colors.redAccent),
                title: const Text('Eliminar salón', style: TextStyle(color: Colors.redAccent)),
                onTap: () async {
                  Navigator.pop(context);
                  try {
                    await ApiService.eliminarSalon(salon['id']);
                    onAccionCompletada();
                  } catch (e) {
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Error al eliminar')));
                    }
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}