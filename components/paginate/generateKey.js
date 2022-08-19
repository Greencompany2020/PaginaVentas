export default function generateKey(pre){
    return `${pre}_${Date.now()}`
}