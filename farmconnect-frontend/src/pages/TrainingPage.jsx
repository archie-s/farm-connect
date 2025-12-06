import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, GraduationCap, Users, Award, Clock, Star, Play, Download, Calendar
} from 'lucide-react'

const TrainingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Training Center</h1>
            <p className="text-gray-600 mt-1">Enhance your farming skills</p>
          </div>
          <Badge className="bg-blue-100 text-blue-600 border-0">
            <GraduationCap className="h-4 w-4 mr-1" />
            Student Level
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Available Courses</CardTitle>
              <CardDescription>Learn from experts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-white">
                  <h3 className="font-semibold">Sustainable Farming 101</h3>
                  <p className="text-sm text-gray-500 mb-2">Master the basics of eco-friendly agriculture.</p>
                  <Button className="w-full bg-green-600 text-white">Start Learning</Button>
                </div>
                <div className="p-4 border rounded-lg bg-white">
                  <h3 className="font-semibold">Digital Marketing for Farmers</h3>
                  <p className="text-sm text-gray-500 mb-2">Sell your produce online effectively.</p>
                  <Button className="w-full bg-green-600 text-white">Start Learning</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Keep up the good work!</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Award className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">No Certificates Yet</h3>
              <p className="text-sm text-gray-500">Complete a course to earn your first badge!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TrainingPage
