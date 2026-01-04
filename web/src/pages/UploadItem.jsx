import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import { itemsAPI } from '../lib/api';

const UploadItem = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    model: '',
    size: '',
    color: '',
    purchasePrice: '',
    purchaseDate: '',
    purchaseLocation: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 10) {
      setError('Máximo de 10 imagens permitidas');
      return;
    }

    // Validar tipos de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError('Apenas arquivos JPEG, JPG e PNG são permitidos');
      return;
    }

    // Validar tamanho dos arquivos (10MB cada)
    const maxSize = 10 * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setError('Cada imagem deve ter no máximo 10MB');
      return;
    }

    setImages([...images, ...files]);
    
    // Criar previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, {
          file,
          url: e.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
    
    setError('');
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      setError('Pelo menos uma imagem é obrigatória');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      
      // Adicionar dados do formulário
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Adicionar imagens
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await itemsAPI.create(formDataToSend);
      
      setSuccess('Item enviado com sucesso! Aguarde a avaliação dos especialistas.');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/my-items');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Erro ao enviar item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Enviar Item para Avaliação</h1>
        <p className="text-muted-foreground mt-2">
          Preencha os dados do seu tênis e envie fotos para avaliação de autenticidade
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Item</CardTitle>
          <CardDescription>
            Forneça o máximo de detalhes possível para uma avaliação mais precisa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Informações básicas */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: Nike Air Jordan 1 Retro High"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand">Marca *</Label>
                <Input
                  id="brand"
                  name="brand"
                  placeholder="Ex: Nike, Adidas, Jordan"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  id="model"
                  name="model"
                  placeholder="Ex: Air Jordan 1 Retro High"
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="size">Tamanho</Label>
                <Input
                  id="size"
                  name="size"
                  placeholder="Ex: 42, US 9, UK 8"
                  value={formData.size}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <Input
                id="color"
                name="color"
                placeholder="Ex: Preto/Vermelho, Branco/Azul"
                value={formData.color}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descreva o estado do item, detalhes importantes, etc."
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {/* Informações de compra */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações de Compra (Opcional)</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Preço de Compra (R$)</Label>
                  <Input
                    id="purchasePrice"
                    name="purchasePrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Data da Compra</Label>
                  <Input
                    id="purchaseDate"
                    name="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseLocation">Local de Compra</Label>
                <Input
                  id="purchaseLocation"
                  name="purchaseLocation"
                  placeholder="Ex: Loja oficial, Site da marca, Marketplace"
                  value={formData.purchaseLocation}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Upload de imagens */}
            <div className="space-y-4">
              <div>
                <Label>Imagens do Item *</Label>
                <p className="text-sm text-muted-foreground">
                  Envie fotos claras de diferentes ângulos. Máximo 10 imagens, 10MB cada.
                </p>
              </div>
              
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium">Clique para selecionar imagens</p>
                  <p className="text-xs text-muted-foreground">JPEG, JPG, PNG até 10MB</p>
                </label>
              </div>

              {/* Preview das imagens */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  {images.length < 10 && (
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                    >
                      <Plus className="h-8 w-8 text-muted-foreground" />
                    </label>
                  )}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar para Avaliação'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadItem;

