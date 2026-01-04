import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, CheckCircle, Users, Star, Smartphone, Monitor } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-16">
        <div className="flex justify-center">
          <Shield className="h-20 w-20 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          TrustMe <span className="text-primary">Admin Panel</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Painel administrativo para especialistas avaliarem a autenticidade de tênis 
          enviados pelos usuários através do aplicativo mobile.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/admin/login" className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Acesso Admin</span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/public-items" className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Ver Avaliações Públicas</span>
            </Link>
          </Button>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Como Funciona a Plataforma</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ecossistema completo para verificação de autenticidade de tênis
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center">
                <Smartphone className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>App Mobile (Usuários)</CardTitle>
              <CardDescription>
                Usuários tiram fotos dos tênis e enviam para avaliação através do aplicativo mobile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Upload de múltiplas fotos</li>
                <li>• Informações detalhadas do item</li>
                <li>• Acompanhamento do status</li>
                <li>• Histórico de avaliações</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center">
                <Monitor className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>Painel Web (Especialistas)</CardTitle>
              <CardDescription>
                Especialistas avaliam os itens enviados através deste painel administrativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Visualização detalhada dos itens</li>
                <li>• Ferramentas de avaliação</li>
                <li>• Gestão de avaliações</li>
                <li>• Relatórios e estatísticas</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features for Admins */}
      <section className="bg-muted/50 rounded-lg p-8 md:p-12">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-foreground">Recursos para Especialistas</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ferramentas profissionais para avaliação precisa
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center space-y-2">
            <Eye className="h-8 w-8 text-primary mx-auto" />
            <h3 className="font-semibold">Visualização Detalhada</h3>
            <p className="text-sm text-muted-foreground">
              Análise completa com múltiplas imagens
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <CheckCircle className="h-8 w-8 text-primary mx-auto" />
            <h3 className="font-semibold">Sistema de Avaliação</h3>
            <p className="text-sm text-muted-foreground">
              Classificação com níveis de confiança
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <Users className="h-8 w-8 text-primary mx-auto" />
            <h3 className="font-semibold">Gestão de Usuários</h3>
            <p className="text-sm text-muted-foreground">
              Controle de acesso e permissões
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <Star className="h-8 w-8 text-primary mx-auto" />
            <h3 className="font-semibold">Relatórios</h3>
            <p className="text-sm text-muted-foreground">
              Estatísticas e métricas detalhadas
            </p>
          </div>
        </div>
      </section>

      {/* Public Access */}
      <section className="text-center space-y-6 py-16">
        <h2 className="text-3xl font-bold text-foreground">
          Transparência e Confiança
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Todas as avaliações realizadas ficam disponíveis publicamente, 
          garantindo transparência no processo de verificação.
        </p>
        <Button size="lg" variant="outline" asChild>
          <Link to="/public-items" className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Ver Avaliações Públicas</span>
          </Link>
        </Button>
      </section>
    </div>
  );
};

export default Home;

