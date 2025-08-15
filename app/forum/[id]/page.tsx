import React from 'react'
import { ArrowLeft, Clock, MessageCircle, ThumbsUp, Send } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'

// Função necessária para build estático
export async function generateStaticParams() {
	// Gera páginas estáticas para alguns IDs de exemplo
	return [
		{ id: '1' },
		{ id: '2' },
		{ id: '3' },
		{ id: '4' },
		{ id: '5' },
	]
}

interface CommentItem {
	id: string
	author: string
	content: string
	createdAt: string
	likes: number
	hasLiked: boolean
}

interface PageProps {
	params: { id: string }
}

export default function ForumTopicDetailPage({ params }: PageProps) {
	const topicId = params.id

	// Mock do tópico baseado no id (em produção viria de API/estado global)
	const topic = {
		id: topicId,
		title: `Tópico #${topicId}`,
		content: 'Conteúdo detalhado do tópico. Aqui você pode expandir a discussão, ver todas as respostas e participar com seus comentários.',
		author: 'Autor Demo',
		createdAt: new Date().toISOString(),
		replies: 3,
		likes: 10,
	}

	// Mock dos comentários (em produção viria de API)
	const comments: CommentItem[] = [
		{ id: 'c1', author: 'Ana', content: 'Obrigado por compartilhar!', createdAt: new Date().toISOString(), likes: 2, hasLiked: false },
		{ id: 'c2', author: 'Carlos', content: 'Também passei por isso, força!', createdAt: new Date().toISOString(), likes: 1, hasLiked: false },
	]

	return (
		<div className="min-h-screen bg-gradient-to-br from-recovery-50 via-white to-primary-50">
			<div className="px-4 lg:px-8 pb-20 lg:pb-8">
				<div className="max-w-4xl mx-auto space-y-6">
					<div className="flex items-center gap-3 pt-4">
						<Link href="/forum" className="p-2 rounded-lg hover:bg-gray-100">
							<ArrowLeft className="w-5 h-5" />
						</Link>
						<h1 className="text-2xl font-bold text-recovery-800">{topic.title}</h1>
					</div>

					<Card variant="default">
						<div className="space-y-3">
							<div className="text-sm text-recovery-500 flex items-center gap-4">
								<span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{new Date(topic.createdAt).toLocaleString('pt-BR')}</span>
								<span>{topic.replies} respostas</span>
								<span>{topic.likes} curtidas</span>
							</div>
							<p className="text-recovery-700 leading-relaxed">
								{topic.content}
							</p>
						</div>
					</Card>

					<Card variant="default" className="p-0">
						<div className="p-4 border-b border-recovery-200 flex items-center gap-2">
							<MessageCircle className="w-5 h-5 text-recovery-500" />
							<h2 className="text-lg font-semibold text-recovery-800">Comentários</h2>
						</div>
						<div className="p-4 space-y-4">
							<div className="p-3 border border-recovery-200 rounded-lg bg-gray-50">
								<p className="text-sm text-gray-500">Para adicionar comentários, faça login no aplicativo.</p>
							</div>

							<div className="space-y-3">
								{comments.map((c) => (
									<div key={c.id} className="p-3 border border-recovery-200 rounded-lg">
										<div className="flex items-center justify-between text-sm text-recovery-500 mb-2">
											<span className="font-medium text-recovery-700">{c.author}</span>
											<span>{new Date(c.createdAt).toLocaleString('pt-BR')}</span>
										</div>
										<p className="text-recovery-700 mb-2">{c.content}</p>
										<div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-recovery-100 text-recovery-600">
											<ThumbsUp className="w-3 h-3" /> {c.likes}
										</div>
									</div>
								))}
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	)
}
