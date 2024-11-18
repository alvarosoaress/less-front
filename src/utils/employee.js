// try {
//     return name.split(" ")[0][0] + name.split(" ")[1][0]
// } catch {
//     return name[0]
// }

export function shortName(name) {
    return name.slice(0, 2).toUpperCase();
}
export function generatePastelColor() {
    const r = Math.floor((Math.random() * 128) + 127);
    const g = Math.floor((Math.random() * 128) + 127);
    const b = Math.floor((Math.random() * 128) + 127);

    // Converter RGB para hexadecimal
    const rgbToHex = (color) => {
        const hex = color.toString(16).padStart(2, '0'); // Garante dois dígitos para cada valor
        return hex;
    };

    const hexColor = `#${rgbToHex(r)}${rgbToHex(g)}${rgbToHex(b)}`;

    // Calcular luminância para ajustar o contraste da cor do texto
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const textColor = luminance > 0.68 ? 'black' : 'white';

    return {
        backgroundColor: hexColor,
        textColor,
    };
}

export function getInitials(email) {
    const [first, second] = email.split("@")[0].split("");
    return `${first.toUpperCase()}${second.toLowerCase()}`;
};

export function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function toCurrency(val) {
    const BRreal = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return BRreal.format(val || 0);
}