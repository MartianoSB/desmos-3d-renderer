// dia 1: projeção ortogonal
// dia 2: UI de rotação e zoom, melhoria de cores
// dia 3: html conversor de .obj para arrays de pontos e faces
// dia 4: normais das faces e shader de luminosidade das faces
// dia 5: fixed browser blocking clipboard, z value for vertices
// dia 6: angle between face normal and camera to render faces in correct order
// dia 7: 

const input_elem = document.getElementById('file-input');

const objects_display_elem = document.getElementById('file-objects');
const vertices_display_elem = document.getElementById('file-vertices');
const normals_display_elem = document.getElementById('file-normals');
const faces_display_elem = document.getElementById('file-faces');

const vertex_result_elem = document.getElementById('vertex-array-result');
const normals_result_elem = document.getElementById('normal-array-result');
const faces_result_elem = document.getElementById('face-index-result');
const face_normals_result_elem = document.getElementById('face-normal-index-result');

const Reader = new FileReader();

input_elem.addEventListener('change', function(e) { if (e.target.files[0]) { Reader.readAsText(e.target.files[0]) } });
Reader.onload = function(e) { ConvertObjMath(e.target.result); };

let vertexArray;
let normalArray;
let faceIndices;
let faceNormalIndices;

function ConvertObjMath(string) {
    let lines = string.split('\n');
    objects_display_elem.innerHTML = 'OBJECTS:';
    vertices_display_elem.innerText = 'VERTICES:';
    normals_display_elem.innerText = 'NORMALS:';
    faces_display_elem.innerText = 'FACES:';

    let objects = [];
    let vertices = [];
    let faces = [];
    let normals = [];
    let face_normals = [];

    let o_count = 0;
    let v_count = 0;
    let n_count = 0;
    let f_count = 0;

    lines.forEach(line => {
        if (line.startsWith('o ')) {
            line = line.slice(2);
            objects_display_elem.innerText += '\n' + line;
            objects.push(line);
            o_count += 1;
        }
        else if (line.startsWith('v ')) {
            line = line.slice(2);
            let coords = [parseFloat(line.split(' ')[0]), parseFloat(line.split(' ')[1]), parseFloat(line.split(' ')[2])];
            vertices_display_elem.innerText += '\n' + coords[0] + ", " + coords[1] + ", " + coords[2];
            vertices.push(coords);
            v_count += 1;
        }
        else if (line.startsWith('vn ')) {
            line = line.slice(3);
            let vector = [parseFloat(line.split(' ')[0]), parseFloat(line.split(' ')[1]), parseFloat(line.split(' ')[2])];
            normals_display_elem.innerText += '\n' + vector[0] + ", " + vector[1] + ", " + vector[2];
            normals.push(vector);
            n_count += 1;
        }
        else if (line.startsWith('f ')) {
            line = line.slice(2);
            let line_indexes = line.split(' ');
            faces_display_elem.innerText += '\n';
            let indexes = [];
            for (let i = 0; i < line_indexes.length; i++) {
                faces_display_elem.innerText += parseInt(line_indexes[i]);
                if (i + 1 < line_indexes.length) {
                    faces_display_elem.innerText += ", ";
                }
                indexes.push(parseInt(line_indexes[i]));
            }
            faces.push(indexes);
            face_normals.push(line_indexes[0].split('/')[2]);
            f_count += 1;
        }
    });

    objects_display_elem.innerText += "\nCount: " + o_count;
    vertices_display_elem.innerText += "\nCount: " + v_count;
    normals_display_elem.innerText += "\nCount: " + n_count;
    faces_display_elem.innerText += "\nCount: " + f_count;

    console.log(objects);
    console.log(vertices);
    console.log(normals);
    console.log(faces);

    // vertices:
    let v_str = 'A_v=[';
    vertices.forEach(v => {
        v_str += v[0] + ',' + v[1] + ',' + v[2] + ',';
    });
    v_str = v_str.substring(0, v_str.length - 1);
    v_str += ']';
    vertexArray = v_str;
    vertex_result_elem.innerText = v_str;
    console.log(v_str);

    // normals:
    let n_str = 'A_n=[';
    normals.forEach(n => {
        n_str += n[0] + ',' + n[1] + ',' + n[2] + ',';
    });
    n_str = n_str.substring(0, n_str.length - 1);
    n_str += ']';
    normalArray = n_str;
    normals_result_elem.innerText = n_str;
    console.log(n_str);

    // faces:
    let f_str = 'A_f=[';
    faces.forEach(f => {
        f_str += "\\operatorname{polygon}\\left(";
        f.forEach(f_i => {
            f_str += "p(" + f_i + "),";
        });
        f_str = f_str.substring(0, f_str.length - 1);
        f_str += "\\right),";
    });
    f_str = f_str.substring(0, f_str.length - 1);
    f_str += ']';
    faceIndices = f_str;
    faces_result_elem.innerText = f_str;
    console.log(f_str);

    // face normals:
    let fn_str = 'A_{fn}=[';
    face_normals.forEach(fn => {
        fn_str += fn + ',';
    });
    fn_str = fn_str.substring(0, fn_str.length - 1);
    fn_str += ']';
    faceNormalIndices = fn_str;
    face_normals_result_elem.innerText = fn_str;
    console.log(fn_str);
}

function copyVertexes() {
    navigator.clipboard.writeText(vertexArray);
}

function copyNormals() {
    navigator.clipboard.writeText(normalArray);
}

function copyFaces() {
    navigator.clipboard.writeText(faceIndices);
}

function copyFaceNormals() {
    navigator.clipboard.writeText(faceNormalIndices);
}