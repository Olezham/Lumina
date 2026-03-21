from flask import Blueprint, request, jsonify
from app import db
from app.models import Topic, Material

materials_bp = Blueprint("materials", __name__)


def err(msg, code=400):
    return jsonify({"detail": msg}), code


@materials_bp.post("/topics/<int:topic_id>/materials/text")
def add_text_material(topic_id):
    if not Topic.query.get(topic_id):
        return err("Тема не найдена", 404)

    data    = request.get_json() or {}
    title   = (data.get("title") or "").strip()
    content = (data.get("content") or "").strip()
    if not title or not content:
        return err("Заголовок и содержимое не могут быть пустыми")

    mat = Material(topic_id=topic_id, title=title, content=content, source_type="text")
    db.session.add(mat)
    db.session.commit()
    return jsonify(mat.to_dict()), 201


@materials_bp.post("/topics/<int:topic_id>/materials/file")
def upload_file_material(topic_id):
    if not Topic.query.get(topic_id):
        return err("Тема не найдена", 404)
    if "file" not in request.files:
        return err("Файл не передан")

    file = request.files["file"]
    raw  = file.read()
    try:
        content = raw.decode("utf-8")
    except UnicodeDecodeError:
        content = raw.decode("latin-1")

    if not content.strip():
        return err("Файл пустой")

    title = (request.form.get("title") or file.filename or "").strip()
    mat   = Material(topic_id=topic_id, title=title, content=content.strip(),
                     source_type="file", file_name=file.filename)
    db.session.add(mat)
    db.session.commit()
    return jsonify(mat.to_dict()), 201


@materials_bp.get("/topics/<int:topic_id>/materials")
def list_materials(topic_id):
    if not Topic.query.get(topic_id):
        return err("Тема не найдена", 404)

    mats = Material.query.filter_by(topic_id=topic_id).order_by(Material.created_at).all()
    return jsonify([m.to_dict() for m in mats])


@materials_bp.get("/materials/<int:material_id>")
def get_material(material_id):
    mat = Material.query.get(material_id)
    if not mat:
        return err("Материал не найден", 404)
    return jsonify(mat.to_dict())


@materials_bp.delete("/materials/<int:material_id>")
def delete_material(material_id):
    mat = Material.query.get(material_id)
    if not mat:
        return err("Материал не найден", 404)

    db.session.delete(mat)
    db.session.commit()
    return jsonify({"ok": True})
