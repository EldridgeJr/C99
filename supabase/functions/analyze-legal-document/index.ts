import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface AnalysisRequest {
  documentText: string;
  userId: string;
  documentName: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { documentText, userId, documentName }: AnalysisRequest = await req.json();

    const documentLower = documentText.toLowerCase();
    let documentType = 'Algemeen Juridisch Document';
    let keyTopics: string[] = [];
    let complexity = 'Gemiddeld - Geschatte voorbereidingstijd: 6-8 uur';
    let estimatedPrepTime = '6-8 uur';
    let actionItems: string[] = [];
    let legalConsiderations: string[] = [];
    let relevantCategories: string[] = ['Civil Procedure', 'Legal Writing'];

    if (documentLower.includes('huur') || documentLower.includes('verhuur')) {
      documentType = 'Contractueel Geschil - Huurovereenkomst';
      keyTopics = [
        'Huurrecht (Art. 7:201 BW)',
        'Wanprestatie en schadevergoeding',
        'Bewijslast en documentatie',
        'Procesinleiding dagvaarding'
      ];
      complexity = 'Gemiddeld - Geschatte voorbereidingstijd: 8-12 uur';
      estimatedPrepTime = '8-12 uur';
      actionItems = [
        'Verzamel alle huurovereenkomsten en correspondentie',
        'Documenteer alle gebreken met foto\'s en data',
        'Bereken exacte schadebedragen en gederfde huur',
        'Controleer opzegtermijnen en procedurele vereisten',
        'Overweeg mediation voor kostenbesparing'
      ];
      legalConsiderations = [
        '⚖️ Artikel 7:204 BW - Onderhoudsverplichting verhuurder',
        '⚖️ Bewijslast ligt bij huurder voor gebreken (art. 150 Rv)',
        '⚖️ Redelijke termijn voor herstel moet zijn geboden',
        '⚖️ Huurprijsvermindering mogelijk tijdens gebrekenperiode',
        '⚖️ Griffierecht kantonrechter: €121 voor claims tot €25.000'
      ];
      relevantCategories = ['Contract Law', 'Civil Procedure', 'Legal Writing'];
    } else if (documentLower.includes('arbeidsovereenkomst') || documentLower.includes('ontslag')) {
      documentType = 'Arbeidsrecht - Ontslag of Arbeidsconflict';
      keyTopics = [
        'Arbeidsovereenkomst en opzegging',
        'Ontslagrecht en procedures',
        'Schadevergoeding en transitievergoeding',
        'Kantonrechter procedures'
      ];
      complexity = 'Complex - Geschatte voorbereidingstijd: 12-16 uur';
      estimatedPrepTime = '12-16 uur';
      actionItems = [
        'Verzamel alle arbeidsovereenkomsten en wijzigingen',
        'Documenteer alle communicatie met werkgever',
        'Bereken aanspraken (transitie, loon, vakantiedagen)',
        'Controleer opzegtermijn en procedure',
        'Overweeg bemiddeling of rechtsbijstand'
      ];
      legalConsiderations = [
        '⚖️ Artikel 7:671 BW - Opzegging arbeidsovereenkomst',
        '⚖️ UWV toestemming vereist voor ontslag (art. 7:685 BW)',
        '⚖️ Transitievergoeding berekenen (art. 7:673 BW)',
        '⚖️ Termijn voor herstel arbeidsovereenkomst: 2 maanden',
        '⚖️ Griffierecht kantonrechter: €121'
      ];
      relevantCategories = ['Contract Law', 'Civil Procedure', 'Legal Writing'];
    } else if (documentLower.includes('schadevergoeding') || documentLower.includes('aansprakelijk')) {
      documentType = 'Aansprakelijkheidsrecht - Schadeclaim';
      keyTopics = [
        'Onrechtmatige daad (Art. 6:162 BW)',
        'Causaliteit en toerekening',
        'Schadeberekening en vergoeding',
        'Bewijslast en bewijsmiddelen'
      ];
      complexity = 'Complex - Geschatte voorbereidingstijd: 10-14 uur';
      estimatedPrepTime = '10-14 uur';
      actionItems = [
        'Verzamel alle bewijs van schade (facturen, foto\'s)',
        'Documenteer causaal verband tussen daad en schade',
        'Bereken exacte schade inclusief gederfde inkomsten',
        'Controleer verjaringstermijn (5 jaar)',
        'Overweeg deskundigenrapport bij complexe schade'
      ];
      legalConsiderations = [
        '⚖️ Artikel 6:162 BW - Onrechtmatige daad vereist',
        '⚖️ Bewijslast ligt bij benadeelde partij',
        '⚖️ Causaliteit moet worden aangetoond',
        '⚖️ Schade moet concreet en aantoonbaar zijn',
        '⚖️ Verjaringstermijn: 5 jaar na schade en dader bekend'
      ];
      relevantCategories = ['Tort Law', 'Civil Procedure', 'Legal Writing'];
    } else if (documentLower.includes('koopovereenkomst') || documentLower.includes('levering')) {
      documentType = 'Contractenrecht - Koop en Levering';
      keyTopics = [
        'Koopovereenkomst en wilsovereenstemming',
        'Non-conformiteit en garanties',
        'Ontbinding en schadevergoeding',
        'Bewijslast en bewijs'
      ];
      complexity = 'Gemiddeld - Geschatte voorbereidingstijd: 8-10 uur';
      estimatedPrepTime = '8-10 uur';
      actionItems = [
        'Verzamel koopovereenkomst en correspondentie',
        'Documenteer non-conformiteit met foto\'s',
        'Bereken schade en eventuele vervangingskosten',
        'Controleer of klacht tijdig is ingediend',
        'Overweeg buitengerechtelijke oplossing eerst'
      ];
      legalConsiderations = [
        '⚖️ Artikel 7:17 BW - Non-conformiteit en tijdige klacht',
        '⚖️ Artikel 6:74 BW - Ontbinding overeenkomst',
        '⚖️ Bewijslast non-conformiteit bij koper',
        '⚖️ Klacht binnen redelijke termijn (art. 7:23 BW)',
        '⚖️ Schadevergoeding naast ontbinding mogelijk'
      ];
      relevantCategories = ['Contract Law', 'Civil Procedure', 'Legal Writing'];
    }

    const { data: courses } = await supabase
      .from('courses')
      .select('*')
      .in('category', relevantCategories)
      .limit(4);

    const analysis = {
      documentType,
      keyTopics,
      complexity,
      estimatedPrepTime,
      recommendedCourses: courses || [],
      actionItems,
      legalConsiderations,
      generatedAt: new Date().toISOString(),
    };

    await supabase
      .from('custom_preparations')
      .insert({
        user_id: userId,
        document_name: documentName,
        document_type: documentType,
        analysis_data: analysis,
        status: 'completed',
      });

    return new Response(
      JSON.stringify(analysis),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
