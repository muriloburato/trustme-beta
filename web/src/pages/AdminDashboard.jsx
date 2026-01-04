import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Users, 
  TrendingUp,
  Search,
  Filter,
  Star,
  AlertTriangle
} from 'lucide-react';
import { itemsAPI, evaluationsAPI, usersAPI } from '../lib/api';

const AdminDashboard = ({ user }) => {
  const [pendingItems, setPendingItems] = useState([]);
  const [recentEvaluations, setRecentEvaluations] = useState([]);
  const [stats, setStats] = useState({
    items: { total: 0, pending: 0, approved: 0, rejected: 0 },
    users: { total: 0, active: 0 },
    evaluations: { total: 0, authentic: 0, fake: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [evaluationModal, setEvaluationModal] = useState({ open: false, item: null });
  const [evaluationForm, setEvaluationForm] = useState({
    result: '',
    confidence: '',
    notes: ''
  });
  const [submittingEvaluation, setSubmittingEvaluation] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar itens pendentes
      const pendingResponse = await itemsAPI.getAll({ status: 'pending', limit: 10 });
      setPendingItems(pendingResponse.items || []);
      
      // Buscar avaliações recentes
      const evaluationsResponse = await evaluationsAPI.getMyEvaluations({ limit: 5 });
      setRecentEvaluations(evaluationsResponse.evaluations || []);
      
      // Buscar estatísticas
      const [itemStats, userStats, evalStats] = await Promise.all([
        itemsAPI.getStats(),
        usersAPI.getStats(),
        evaluationsAPI.getStats()
      ]);
      
      setStats({
        items: itemStats.stats,
        users: userStats.stats,
        evaluations: evalStats.stats
      });
      
    } catch (err) {
      setError(err.message || 'Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const openEvaluationModal = (item) => {
    setEvaluationModal({ open: true, item });
    setEvaluationForm({ result: '', confidence: '', notes: '' });
  };

  const closeEvaluationModal = () => {
    setEvaluationModal({ open: false, item: null });
    setEvaluationForm({ result: '', confidence: '', notes: '' });
  };

  const handleEvaluationSubmit = async (e) => {
    e.preventDefault();
    
    if (!evaluationForm.result || !evaluationForm.confidence) {
      setError('Resultado e confiança são obrigatórios');
      return;
    }
    
    setSubmittingEvaluation(true);
    
    try {
      await evaluationsAPI.create({
        itemId: evaluationModal.item.id,
        result: evaluationForm.result,
        confidence: parseInt(evaluationForm.confidence),
        notes: evaluationForm.notes
      });
      
      // Atualizar dados
      await fetchDashboardData();
      closeEvaluationModal();
      
    } catch (err) {
      setError(err.message || 'Erro ao salvar avaliação');
    } finally {
      setSubmittingEvaluation(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getResultIcon = (result) => {
    switch (result) {
      case 'authentic':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fake':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'inconclusive':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4" />;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie avaliações e monitore a plataforma</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Especialista: {user.name}</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.items.pending}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando avaliação
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.items.total}</div>
            <p className="text-xs text-muted-foreground">
              Itens na plataforma
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.active}</div>
            <p className="text-xs text-muted-foreground">
              Usuários registrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.evaluations.total}</div>
            <p className="text-xs text-muted-foreground">
              Avaliações realizadas
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Itens Pendentes</TabsTrigger>
          <TabsTrigger value="recent">Avaliações Recentes</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Itens Aguardando Avaliação</CardTitle>
              <CardDescription>
                Itens enviados pelos usuários que precisam de avaliação
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingItems.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum item pendente</h3>
                  <p className="text-muted-foreground">
                    Todos os itens foram avaliados!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {item.images && item.images.length > 0 && (
                          <img
                            src={`http://localhost:3001${item.images[0].path}`}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.brand} - {item.model}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Enviado por {item.user?.name} em {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/item/${item.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Link>
                        </Button>
                        <Button size="sm" onClick={() => openEvaluationModal(item)}>
                          <Shield className="h-4 w-4 mr-1" />
                          Avaliar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Avaliações Recentes</CardTitle>
              <CardDescription>
                Últimas avaliações realizadas pela equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentEvaluations.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma avaliação ainda</h3>
                  <p className="text-muted-foreground">
                    Comece avaliando os itens pendentes
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentEvaluations.map((evaluation) => (
                    <div key={evaluation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {evaluation.item?.images && evaluation.item.images.length > 0 && (
                          <img
                            src={`http://localhost:3001${evaluation.item.images[0].path}`}
                            alt={evaluation.item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold">{evaluation.item?.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {evaluation.item?.brand} - {evaluation.item?.model}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            {getResultIcon(evaluation.result)}
                            <span className="text-sm font-medium">
                              {getResultText(evaluation.result)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              • {evaluation.confidence}% confiança
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {new Date(evaluation.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/item/${evaluation.item?.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Avaliação */}
      <Dialog open={evaluationModal.open} onOpenChange={closeEvaluationModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Avaliar Item</DialogTitle>
            <DialogDescription>
              Forneça sua avaliação profissional sobre a autenticidade do item
            </DialogDescription>
          </DialogHeader>
          
          {evaluationModal.item && (
            <div className="space-y-6">
              {/* Informações do Item */}
              <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                {evaluationModal.item.images && evaluationModal.item.images.length > 0 && (
                  <img
                    src={`http://localhost:3001${evaluationModal.item.images[0].path}`}
                    alt={evaluationModal.item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{evaluationModal.item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {evaluationModal.item.brand} - {evaluationModal.item.model}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Enviado por {evaluationModal.item.user?.name}
                  </p>
                </div>
              </div>

              {/* Formulário de Avaliação */}
              <form onSubmit={handleEvaluationSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="result">Resultado *</Label>
                    <Select
                      value={evaluationForm.result}
                      onValueChange={(value) => setEvaluationForm(prev => ({ ...prev, result: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o resultado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="authentic">Autêntico</SelectItem>
                        <SelectItem value="fake">Falsificado</SelectItem>
                        <SelectItem value="inconclusive">Inconclusivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confidence">Confiança (%) *</Label>
                    <Input
                      id="confidence"
                      type="number"
                      min="1"
                      max="100"
                      value={evaluationForm.confidence}
                      onChange={(e) => setEvaluationForm(prev => ({ ...prev, confidence: e.target.value }))}
                      placeholder="85"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={evaluationForm.notes}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Descreva os detalhes da sua avaliação, pontos observados, etc."
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={closeEvaluationModal}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={submittingEvaluation}>
                    {submittingEvaluation ? 'Salvando...' : 'Salvar Avaliação'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;

