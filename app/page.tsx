import RegistrationForm from '@/components/RegistrationForm'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Christmas elements */}
      <div className="absolute top-10 left-10 text-4xl animate-bounce">🎄</div>
      <div className="absolute top-20 right-20 text-3xl animate-pulse">❄️</div>
      <div className="absolute bottom-20 left-20 text-3xl animate-bounce delay-300">🎁</div>
      <div className="absolute bottom-10 right-10 text-4xl animate-pulse delay-500">⭐</div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="text-6xl mb-4">🎅</div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-2">
            Secret Santa
          </h1>
          <p className="text-lg text-gray-700 font-medium">Register to participate in this year's Secret Santa! 🎄</p>
        </div>
        <div className="bg-white rounded-xl shadow-2xl p-8 border-4 border-red-200">
          <RegistrationForm />
        </div>
        <p className="text-center text-sm text-gray-600 font-medium">
          ✨ Once everyone is registered, the admin will trigger the assignments ✨
        </p>
      </div>
    </div>
  )
}
