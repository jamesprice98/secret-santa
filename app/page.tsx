import RegistrationForm from '@/components/RegistrationForm'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Secret Santa</h1>
          <p className="text-lg text-gray-600">Register to participate in this year's Secret Santa!</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <RegistrationForm />
        </div>
        <p className="text-center text-sm text-gray-500">
          Once everyone is registered, the admin will trigger the assignments.
        </p>
      </div>
    </div>
  )
}
