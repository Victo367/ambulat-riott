import InfoCard from "@/components/InfoCard";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">

      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          Ambulatório TT Marcela Prado
        </h1>

        <p className="text-zinc-600 mt-2 max-w-3xl">
          Ambulatório de Saúde Integral para Travestis e Transexuais “Marcela Prado” do Hospital de Emergência e Trauma Dom Luiz Gonzaga Fernandes, que integra a rede hospitalar do Governo da Paraíba, em Campina Grande, tem a proposta de oferecer um serviço de atenção básica de forma acolhedora, onde os usuários recebam assistência de profissionais de saúde especializados.
        </p>
      </div>

      <Image
        src="/ambulatorio.jpg"
        alt="Ambulatório"
        width={800}
        height={300}
        className="w-full h-64 object-cover rounded-xl"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
        <InfoCard
          title="Terapia hormonal segura"
          description="A terapia hormonal para pessoas trans é altamente segura pois garante a qualidade de vida e o bem-estar, além de ser um passo importante para a afirmação de gênero."
          image="/comunidadetrans.jpg"
        />

        <InfoCard
          title="Transgeneridade"
          description="A transgeneridade é uma condição em que a identidade de gênero de uma pessoa difere do sexo atribuído no nascimento, e o tratamento hormonal é uma parte fundamental do processo de afirmação de gênero para muitas"
          image="/trans.jpg"
        />
      </div>
    </div>
  );
}