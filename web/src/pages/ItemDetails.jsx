import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  DollarSign, 
  User, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock,
  Star,
  Eye
} from 'lucide-react';
import { itemsAPI, getCurrentUser, isAuthenticated } from '../lib/api';

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const currentUser = getCurrentUser();

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      let response;
      
      // Usar endpoint apropriado baseado na autenticação
      if (isAuthenticated()) {
        response = await itemsAPI.getById(id);
      } else {
        response = await itemsAPI.getPublicById(id);
      }
      
      setItem(response.item);
    } catch (err) {
      setError(err.message || 'Erro ao carregar detalhes do item');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5" />;
      case 'rejected':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Reprovado';
      default:
        return 'Pendente';
    }
  };

  const getResultText = (result) => {
    switch (result) {
      case 'authentic':
        return 'Autêntico';
      case 'fake':
        return 'Falsificado';
      case 'inconclusive':
        return 'Inconclusivo';
      default:
        return 'Pendente';
    }
  };

  const getResultIcon = (result) => {
    switch (result) {
      case 'authentic':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'fake':
        return <XCircle className="h-6 w-6 text-red-600" />;
      case 'inconclusive':
        return <Shield className="h-6 w-6 text-yellow-600" />;
      default:
        return <Clock className="h-6 w-6 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link to="/public-items" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Item não encontrado</h2>
        <Button asChild>
          <Link to="/public-items">Voltar aos Itens</Link>
        </Button>
      </div>
    );
  }

  const isOwner = currentUser && currentUser.id === item.userId;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" asChild>
          <Link to={isOwner ? "/my-items" : "/public-items"} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{item.title}</h1>
          <p className="text-muted-foreground">{item.brand} - {item.model}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Imagens */}
        <div className="space-y-4">
          {item.images && item.images.length > 0 ? (
            <>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={`http://localhost:3001${item.images[selectedImageIndex].path}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {item.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        index === selectedImageIndex 
                          ? 'border-primary' 
                          : 'border-transparent hover:border-border'
                      }`}
                    >
                      <img
                        src={`http://localhost:3001${image.path}`}
                        alt={`${item.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              <Shield className="h-24 w-24 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Status da Avaliação</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                {getStatusIcon(item.status)}
                <Badge variant={getStatusVariant(item.status)} className="text-sm">
                  {getStatusText(item.status)}
                </Badge>
              </div>
              
              {item.evaluation ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {getResultIcon(item.evaluation.result)}
                    <div>
                      <p className="font-semibold text-lg">
                        {getResultText(item.evaluation.result)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Confiança: {item.evaluation.confidence}%
                      </p>
                    </div>
                  </div>
                  
                  {item.evaluation.notes && (
                    <div>
                      <h4 className="font-medium mb-2">Observações do Especialista:</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {item.evaluation.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Avaliado por {item.evaluation.evaluator?.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Avaliado em {new Date(item.evaluation.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Aguardando avaliação de um especialista...
                </p>
              )}
            </CardContent>
          </Card>

          {/* Detalhes do Item */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Marca</p>
                  <p className="text-sm text-muted-foreground">{item.brand}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Modelo</p>
                  <p className="text-sm text-muted-foreground">{item.model}</p>
                </div>
              </div>
              
              {(item.size || item.color) && (
                <div className="grid grid-cols-2 gap-4">
                  {item.size && (
                    <div>
                      <p className="text-sm font-medium">Tamanho</p>
                      <p className="text-sm text-muted-foreground">{item.size}</p>
                    </div>
                  )}
                  {item.color && (
                    <div>
                      <p className="text-sm font-medium">Cor</p>
                      <p className="text-sm text-muted-foreground">{item.color}</p>
                    </div>
                  )}
                </div>
              )}
              
              {item.description && (
                <div>
                  <p className="text-sm font-medium mb-2">Descrição</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              )}
              
              <Separator />
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Enviado em {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              {!isOwner && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Enviado por {item.user?.name}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações de Compra (apenas para o dono) */}
          {isOwner && (item.purchasePrice || item.purchaseDate || item.purchaseLocation) && (
            <Card>
              <CardHeader>
                <CardTitle>Informações de Compra</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {item.purchasePrice && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">
                      Preço: R$ {parseFloat(item.purchasePrice).toFixed(2)}
                    </span>
                  </div>
                )}
                
                {item.purchaseDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      Data: {new Date(item.purchaseDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                
                {item.purchaseLocation && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Local: {item.purchaseLocation}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;

