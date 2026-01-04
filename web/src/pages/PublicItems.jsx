import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, CheckCircle, XCircle, Eye, Filter, Shield } from 'lucide-react';
import { itemsAPI } from '../lib/api';

const PublicItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchPublicItems();
  }, [pagination.page, statusFilter]);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, statusFilter]);

  const fetchPublicItems = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await itemsAPI.getPublic(params);
      setItems(response.items || []);
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0
      }));
    } catch (err) {
      setError(err.message || 'Erro ao carregar itens');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredItems(filtered);
  };

  const getStatusVariant = (status) => {
    switch (status) {
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
      case 'approved':
        return 'Autêntico';
      case 'rejected':
        return 'Falsificado';
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
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fake':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading && pagination.page === 1) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Itens Avaliados</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore o histórico público de avaliações de autenticidade realizadas por nossos especialistas
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título, marca ou modelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="approved">Autênticos</SelectItem>
                <SelectItem value="rejected">Falsificados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de itens */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {items.length === 0 ? 'Nenhum item avaliado ainda' : 'Nenhum item corresponde aos filtros'}
            </h3>
            <p className="text-muted-foreground">
              {items.length === 0 
                ? 'Aguarde as primeiras avaliações serem realizadas'
                : 'Tente ajustar os filtros para encontrar itens'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video relative bg-muted">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={`http://localhost:3001${item.images[0].path}`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Shield className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={getStatusVariant(item.status)}>
                      {getStatusText(item.status)}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                  <CardDescription>
                    {item.brand} - {item.model}
                    {item.size && ` • Tamanho ${item.size}`}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {item.evaluation ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {getResultIcon(item.evaluation.result)}
                          <span className="font-medium">
                            {getResultText(item.evaluation.result)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Confiança: {item.evaluation.confidence}%</span>
                          <span>
                            Avaliado por {item.evaluation.evaluator?.name}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Aguardando avaliação
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      Enviado em {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                    
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/item/${item.id}`} className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>Ver Detalhes</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
              >
                Anterior
              </Button>
              
              <span className="flex items-center px-4 py-2">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages || loading}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PublicItems;

