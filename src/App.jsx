import React, { useState, useEffect, useRef } from 'react';
import { Activity, Target, Zap, Clock, TrendingUp, BarChart3, Heart, Brain } from 'lucide-react';

const GaitAnalysisApp = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [cadence, setCadence] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [walkingPhase, setWalkingPhase] = useState(0);
  const animationRef = useRef();

  // Generate comprehensive dummy metrics
  const generateGaitMetrics = () => ({
    temporal: {
      stepLength: Math.random() * 20 + 65, // cm
      strideLength: Math.random() * 40 + 130, // cm
      stepTime: Math.random() * 0.1 + 0.5, // seconds
      strideTime: Math.random() * 0.2 + 1.0, // seconds
      swingTime: Math.random() * 0.1 + 0.35, // seconds
      stanceTime: Math.random() * 0.1 + 0.65, // seconds
      doubleSupportTime: Math.random() * 0.05 + 0.1, // seconds
      walkingSpeed: Math.random() * 0.5 + 1.2, // m/s
    },
    spatial: {
      stepWidth: Math.random() * 5 + 8, // cm
      footAngle: Math.random() * 10 + 5, // degrees
      hipAbduction: Math.random() * 5 + 3, // degrees
      kneeFlexion: Math.random() * 20 + 50, // degrees
      ankleFlexion: Math.random() * 15 + 10, // degrees
      pelvicTilt: Math.random() * 3 + 2, // degrees
      pelvicRotation: Math.random() * 4 + 3, // degrees
    },
    kinetic: {
      groundReactionForce: Math.random() * 0.3 + 1.1, // body weight
      mediolateralForce: Math.random() * 0.1 + 0.05, // body weight
      anteriorPosteriorForce: Math.random() * 0.2 + 0.15, // body weight
      loadingRate: Math.random() * 20 + 80, // N/kg/s
      pushOffForce: Math.random() * 0.2 + 0.8, // body weight
      impactPeak: Math.random() * 0.3 + 0.9, // body weight
    },
    stability: {
      centerOfMassDisplacement: Math.random() * 2 + 3, // cm
      lateralStability: Math.random() * 10 + 85, // %
      dynamicStability: Math.random() * 8 + 88, // %
      gaitSymmetry: Math.random() * 5 + 92, // %
      rhythmicity: Math.random() * 6 + 91, // %
      variability: Math.random() * 3 + 2, // %
    },
    energy: {
      metabolicCost: Math.random() * 0.5 + 2.5, // J/kg/m
      mechanicalWork: Math.random() * 0.3 + 1.2, // J/kg/m
      efficiency: Math.random() * 5 + 85, // %
      powerGeneration: Math.random() * 50 + 200, // W/kg
      powerAbsorption: Math.random() * 40 + 180, // W/kg
    },
    clinical: {
      gaitDeviationIndex: Math.random() * 20 + 80,
      walkingHandicap: Math.random() * 15 + 5,
      functionalMobility: Math.random() * 10 + 85,
      fallRisk: Math.random() * 20 + 10,
      fatigueIndex: Math.random() * 25 + 15,
      painIndex: Math.random() * 30 + 5,
      confidenceLevel: Math.random() * 15 + 80,
    }
  });

  const [gaitMetrics, setGaitMetrics] = useState(generateGaitMetrics());

  // Animation loop for walking figure
  useEffect(() => {
    if (isRecording) {
      const animate = () => {
        setWalkingPhase(prev => (prev + 0.1) % (Math.PI * 2));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording]);

  // Timer and step counting logic
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 0.1;
          if (newTime >= 15) {
            setIsRecording(false);
            setShowAnalytics(true);
            return 15;
          }
          return newTime;
        });
        
        // Simulate step detection
        if (Math.random() < 0.15) {
          setStepCount(prev => prev + 1);
        }
        
        // Calculate cadence (steps per minute)
        setCadence(prev => Math.max(0, prev + (Math.random() - 0.5) * 5));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setShowAnalytics(false);
    setStepCount(0);
    setCadence(100);
    setTimeElapsed(0);
    setGaitMetrics(generateGaitMetrics());
  };

  const resetApp = () => {
    setIsRecording(false);
    setShowAnalytics(false);
    setStepCount(0);
    setCadence(0);
    setTimeElapsed(0);
    setWalkingPhase(0);
  };

  // Human pose landmark positions (frontal view walking towards viewer)
  const baseX = 200;
  const baseY = 100;
  
  // Core body movement (slight up-down bob and subtle left-right sway)
  const bodyBob = Math.sin(walkingPhase * 2) * 2;
  const bodySway = Math.sin(walkingPhase) * 1.5; // Subtle weight shift
  const centerX = baseX + bodySway;
  const centerY = baseY + bodyBob;
  
  // Head landmarks (stable, facing forward)
  const nose = { x: centerX, y: centerY };
  const leftEye = { x: centerX - 8, y: centerY - 3 };
  const rightEye = { x: centerX + 8, y: centerY - 3 };
  const leftEar = { x: centerX - 12, y: centerY };
  const rightEar = { x: centerX + 12, y: centerY };
  
  // Shoulder landmarks (stable width)
  const shoulderWidth = 25;
  const leftShoulder = { x: centerX - shoulderWidth, y: centerY + 35 };
  const rightShoulder = { x: centerX + shoulderWidth, y: centerY + 35 };
  
  // Arms - natural walking swing (alternating forward/back motion)
  const armSwingAngle = Math.sin(walkingPhase) * 0.6; // Reduced swing for frontal view
  const leftArmSwing = Math.sin(walkingPhase) * 15;
  const rightArmSwing = Math.sin(walkingPhase + Math.PI) * 15;
  
  const leftElbow = { 
    x: leftShoulder.x + leftArmSwing * 0.7, 
    y: leftShoulder.y + 40 + Math.abs(leftArmSwing) * 0.2 
  };
  const rightElbow = { 
    x: rightShoulder.x + rightArmSwing * 0.7, 
    y: rightShoulder.y + 40 + Math.abs(rightArmSwing) * 0.2 
  };
  
  const leftWrist = { 
    x: leftElbow.x + leftArmSwing * 0.5, 
    y: leftElbow.y + 30 
  };
  const rightWrist = { 
    x: rightElbow.x + rightArmSwing * 0.5, 
    y: rightElbow.y + 30 
  };
  
  // Hip landmarks (stable, with slight weight shift)
  const hipWidth = 12;
  const leftHip = { x: centerX - hipWidth + bodySway * 0.5, y: centerY + 85 };
  const rightHip = { x: centerX + hipWidth + bodySway * 0.5, y: centerY + 85 };
  
  // Walking cycle - alternating leg lift (one leg forward, one back)
  const stepPhase = walkingPhase % (Math.PI * 2);
  const leftLegLift = Math.max(0, Math.sin(stepPhase)) * 15; // Left leg lifts
  const rightLegLift = Math.max(0, Math.sin(stepPhase + Math.PI)) * 15; // Right leg lifts
  
  // Knee positions - legs alternate stepping forward
  const leftKnee = { 
    x: leftHip.x - Math.sin(stepPhase) * 8, // Slight forward/back movement
    y: leftHip.y + 45 - leftLegLift * 0.7 // Knee lifts during step
  };
  const rightKnee = { 
    x: rightHip.x - Math.sin(stepPhase + Math.PI) * 8,
    y: rightHip.y + 45 - rightLegLift * 0.7
  };
  
  // Ankle positions - feet lift alternately
  const leftAnkle = { 
    x: leftKnee.x - Math.sin(stepPhase) * 5,
    y: centerY + 175 - leftLegLift // Foot lifts off ground
  };
  const rightAnkle = { 
    x: rightKnee.x - Math.sin(stepPhase + Math.PI) * 5,
    y: centerY + 175 - rightLegLift
  };
  
  // Foot landmarks - toes and heels
  const leftHeel = { x: leftAnkle.x - 6, y: leftAnkle.y + 8 };
  const leftFootIndex = { x: leftAnkle.x + 6, y: leftAnkle.y + 8 };
  const rightHeel = { x: rightAnkle.x - 6, y: rightAnkle.y + 8 };
  const rightFootIndex = { x: rightAnkle.x + 6, y: rightAnkle.y + 8 };
  
  // All pose landmarks for easy rendering
  const landmarks = [
    { name: 'nose', pos: nose, color: '#ef4444' },
    { name: 'leftEye', pos: leftEye, color: '#3b82f6' },
    { name: 'rightEye', pos: rightEye, color: '#3b82f6' },
    { name: 'leftEar', pos: leftEar, color: '#8b5cf6' },
    { name: 'rightEar', pos: rightEar, color: '#8b5cf6' },
    { name: 'leftShoulder', pos: leftShoulder, color: '#10b981' },
    { name: 'rightShoulder', pos: rightShoulder, color: '#10b981' },
    { name: 'leftElbow', pos: leftElbow, color: '#f59e0b' },
    { name: 'rightElbow', pos: rightElbow, color: '#f59e0b' },
    { name: 'leftWrist', pos: leftWrist, color: '#06b6d4' },
    { name: 'rightWrist', pos: rightWrist, color: '#06b6d4' },
    { name: 'leftHip', pos: leftHip, color: '#ec4899' },
    { name: 'rightHip', pos: rightHip, color: '#ec4899' },
    { name: 'leftKnee', pos: leftKnee, color: '#84cc16' },
    { name: 'rightKnee', pos: rightKnee, color: '#84cc16' },
    { name: 'leftAnkle', pos: leftAnkle, color: '#f97316' },
    { name: 'rightAnkle', pos: rightAnkle, color: '#f97316' },
    { name: 'leftHeel', pos: leftHeel, color: '#6366f1' },
    { name: 'rightHeel', pos: rightHeel, color: '#6366f1' },
    { name: 'leftFootIndex', pos: leftFootIndex, color: '#6366f1' },
    { name: 'rightFootIndex', pos: rightFootIndex, color: '#6366f1' }
  ];
  
  // Skeleton connections (frontal view)
  const connections = [
    // Face
    [leftEye, rightEye],
    [leftEye, nose],
    [rightEye, nose],
    [leftEye, leftEar],
    [rightEye, rightEar],
    
    // Torso
    [leftShoulder, rightShoulder],
    [leftShoulder, leftHip],
    [rightShoulder, rightHip],
    [leftHip, rightHip],
    
    // Left arm
    [leftShoulder, leftElbow],
    [leftElbow, leftWrist],
    
    // Right arm
    [rightShoulder, rightElbow],
    [rightElbow, rightWrist],
    
    // Left leg
    [leftHip, leftKnee],
    [leftKnee, leftAnkle],
    [leftAnkle, leftHeel],
    [leftAnkle, leftFootIndex],
    
    // Right leg
    [rightHip, rightKnee],
    [rightKnee, rightAnkle],
    [rightAnkle, rightHeel],
    [rightAnkle, rightFootIndex]
  ];

  const MetricCard = ({ title, value, unit, icon: Icon, color }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {typeof value === 'number' ? value.toFixed(1) : value}
        <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
      </div>
    </div>
  );

  if (showAnalytics) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gait Analysis Report</h1>
                <p className="text-gray-600">Comprehensive biomechanical assessment</p>
              </div>
              <button
                onClick={resetApp}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                New Analysis
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-8">
              <MetricCard 
                title="Total Steps" 
                value={stepCount} 
                unit="steps" 
                icon={Activity} 
                color="bg-blue-500" 
              />
              <MetricCard 
                title="Final Cadence" 
                value={cadence} 
                unit="spm" 
                icon={Target} 
                color="bg-green-500" 
              />
              <MetricCard 
                title="Recording Time" 
                value={timeElapsed} 
                unit="sec" 
                icon={Clock} 
                color="bg-purple-500" 
              />
              <MetricCard 
                title="Walking Speed" 
                value={gaitMetrics.temporal.walkingSpeed} 
                unit="m/s" 
                icon={TrendingUp} 
                color="bg-orange-500" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Temporal Parameters */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="text-blue-600" size={20} />
                  Temporal Parameters
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard title="Step Length" value={gaitMetrics.temporal.stepLength} unit="cm" icon={Activity} color="bg-blue-400" />
                  <MetricCard title="Stride Length" value={gaitMetrics.temporal.strideLength} unit="cm" icon={Activity} color="bg-blue-400" />
                  <MetricCard title="Step Time" value={gaitMetrics.temporal.stepTime} unit="s" icon={Clock} color="bg-blue-400" />
                  <MetricCard title="Stride Time" value={gaitMetrics.temporal.strideTime} unit="s" icon={Clock} color="bg-blue-400" />
                  <MetricCard title="Swing Time" value={gaitMetrics.temporal.swingTime} unit="s" icon={Clock} color="bg-blue-400" />
                  <MetricCard title="Stance Time" value={gaitMetrics.temporal.stanceTime} unit="s" icon={Clock} color="bg-blue-400" />
                </div>
              </div>

              {/* Spatial Parameters */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="text-green-600" size={20} />
                  Spatial Parameters
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard title="Step Width" value={gaitMetrics.spatial.stepWidth} unit="cm" icon={Target} color="bg-green-400" />
                  <MetricCard title="Foot Angle" value={gaitMetrics.spatial.footAngle} unit="°" icon={Target} color="bg-green-400" />
                  <MetricCard title="Hip Abduction" value={gaitMetrics.spatial.hipAbduction} unit="°" icon={Target} color="bg-green-400" />
                  <MetricCard title="Knee Flexion" value={gaitMetrics.spatial.kneeFlexion} unit="°" icon={Target} color="bg-green-400" />
                  <MetricCard title="Ankle Flexion" value={gaitMetrics.spatial.ankleFlexion} unit="°" icon={Target} color="bg-green-400" />
                  <MetricCard title="Pelvic Tilt" value={gaitMetrics.spatial.pelvicTilt} unit="°" icon={Target} color="bg-green-400" />
                </div>
              </div>

              {/* Kinetic Parameters */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Zap className="text-yellow-600" size={20} />
                  Kinetic Parameters
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard title="Ground Reaction Force" value={gaitMetrics.kinetic.groundReactionForce} unit="BW" icon={Zap} color="bg-yellow-400" />
                  <MetricCard title="Loading Rate" value={gaitMetrics.kinetic.loadingRate} unit="N/kg/s" icon={Zap} color="bg-yellow-400" />
                  <MetricCard title="Push Off Force" value={gaitMetrics.kinetic.pushOffForce} unit="BW" icon={Zap} color="bg-yellow-400" />
                  <MetricCard title="Impact Peak" value={gaitMetrics.kinetic.impactPeak} unit="BW" icon={Zap} color="bg-yellow-400" />
                  <MetricCard title="ML Force" value={gaitMetrics.kinetic.mediolateralForce} unit="BW" icon={Zap} color="bg-yellow-400" />
                  <MetricCard title="AP Force" value={gaitMetrics.kinetic.anteriorPosteriorForce} unit="BW" icon={Zap} color="bg-yellow-400" />
                </div>
              </div>

              {/* Stability Parameters */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="text-purple-600" size={20} />
                  Stability & Balance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard title="Gait Symmetry" value={gaitMetrics.stability.gaitSymmetry} unit="%" icon={BarChart3} color="bg-purple-400" />
                  <MetricCard title="Dynamic Stability" value={gaitMetrics.stability.dynamicStability} unit="%" icon={BarChart3} color="bg-purple-400" />
                  <MetricCard title="Lateral Stability" value={gaitMetrics.stability.lateralStability} unit="%" icon={BarChart3} color="bg-purple-400" />
                  <MetricCard title="Rhythmicity" value={gaitMetrics.stability.rhythmicity} unit="%" icon={BarChart3} color="bg-purple-400" />
                  <MetricCard title="CoM Displacement" value={gaitMetrics.stability.centerOfMassDisplacement} unit="cm" icon={BarChart3} color="bg-purple-400" />
                  <MetricCard title="Variability" value={gaitMetrics.stability.variability} unit="%" icon={BarChart3} color="bg-purple-400" />
                </div>
              </div>

              {/* Energy Parameters */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Heart className="text-red-600" size={20} />
                  Energy & Efficiency
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard title="Metabolic Cost" value={gaitMetrics.energy.metabolicCost} unit="J/kg/m" icon={Heart} color="bg-red-400" />
                  <MetricCard title="Mechanical Work" value={gaitMetrics.energy.mechanicalWork} unit="J/kg/m" icon={Heart} color="bg-red-400" />
                  <MetricCard title="Efficiency" value={gaitMetrics.energy.efficiency} unit="%" icon={Heart} color="bg-red-400" />
                  <MetricCard title="Power Generation" value={gaitMetrics.energy.powerGeneration} unit="W/kg" icon={Heart} color="bg-red-400" />
                  <MetricCard title="Power Absorption" value={gaitMetrics.energy.powerAbsorption} unit="W/kg" icon={Heart} color="bg-red-400" />
                </div>
              </div>

              {/* Clinical Assessment */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Brain className="text-indigo-600" size={20} />
                  Clinical Assessment
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard title="Gait Deviation Index" value={gaitMetrics.clinical.gaitDeviationIndex} unit="" icon={Brain} color="bg-indigo-400" />
                  <MetricCard title="Walking Handicap" value={gaitMetrics.clinical.walkingHandicap} unit="" icon={Brain} color="bg-indigo-400" />
                  <MetricCard title="Functional Mobility" value={gaitMetrics.clinical.functionalMobility} unit="%" icon={Brain} color="bg-indigo-400" />
                  <MetricCard title="Fall Risk" value={gaitMetrics.clinical.fallRisk} unit="%" icon={Brain} color="bg-indigo-400" />
                  <MetricCard title="Fatigue Index" value={gaitMetrics.clinical.fatigueIndex} unit="" icon={Brain} color="bg-indigo-400" />
                  <MetricCard title="Confidence Level" value={gaitMetrics.clinical.confidenceLevel} unit="%" icon={Brain} color="bg-indigo-400" />
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Clinical Summary</h3>
              <p className="text-blue-800">
                Patient demonstrates {gaitMetrics.clinical.gaitDeviationIndex > 85 ? 'excellent' : gaitMetrics.clinical.gaitDeviationIndex > 70 ? 'good' : 'concerning'} 
                gait patterns with a symmetry of {gaitMetrics.stability.gaitSymmetry.toFixed(1)}%. 
                Dynamic stability is {gaitMetrics.stability.dynamicStability > 85 ? 'within normal limits' : 'below recommended thresholds'}.
                Fall risk assessment indicates {gaitMetrics.clinical.fallRisk < 20 ? 'low' : gaitMetrics.clinical.fallRisk < 40 ? 'moderate' : 'high'} risk.
                Recommend {gaitMetrics.clinical.functionalMobility < 80 ? 'targeted rehabilitation' : 'maintenance of current activity level'}.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gait Analysis System</h1>
          <p className="text-gray-600">Medical-grade biomechanical assessment</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-gray-50 rounded-lg p-8 w-96 h-80 relative overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 400 350" className="absolute inset-0">
              {/* Walking surface */}
              <line x1="0" y1="300" x2="400" y2="300" stroke="#e5e7eb" strokeWidth="2" />
              
              {/* Human pose skeleton connections */}
              {connections.map((connection, index) => (
                <line
                  key={index}
                  x1={connection[0].x}
                  y1={connection[0].y}
                  x2={connection[1].x}
                  y2={connection[1].y}
                  stroke="#374151"
                  strokeWidth="2"
                />
              ))}
              
              {/* Pose landmarks (keypoints) */}
              {landmarks.map((landmark, index) => (
                <circle
                  key={index}
                  cx={landmark.pos.x}
                  cy={landmark.pos.y}
                  r="4"
                  fill={landmark.color}
                  stroke="white"
                  strokeWidth="1"
                />
              ))}
              
              {/* Ground contact indicators - only show foot on ground */}
              {isRecording && (
                <>
                  {/* Only show ground contact for the foot that's down */}
                  {leftAnkle.y >= centerY + 170 && (
                    <circle cx={leftHeel.x} cy={leftHeel.y + 5} r="6" fill="#ef4444" opacity="0.7" />
                  )}
                  {rightAnkle.y >= centerY + 170 && (
                    <circle cx={rightHeel.x} cy={rightHeel.y + 5} r="6" fill="#ef4444" opacity="0.7" />
                  )}
                </>
              )}
              
              {/* Pose landmark labels (only during recording) */}
              {isRecording && (
                <g className="text-xs fill-gray-600">
                  <text x={nose.x + 8} y={nose.y - 5} fontSize="10">Nose</text>
                  <text x={leftShoulder.x - 25} y={leftShoulder.y} fontSize="10">L.Shoulder</text>
                  <text x={rightShoulder.x + 10} y={rightShoulder.y} fontSize="10">R.Shoulder</text>
                  <text x={leftElbow.x - 20} y={leftElbow.y} fontSize="10">L.Elbow</text>
                  <text x={rightElbow.x + 10} y={rightElbow.y} fontSize="10">R.Elbow</text>
                  <text x={leftHip.x - 15} y={leftHip.y} fontSize="10">L.Hip</text>
                  <text x={rightHip.x + 10} y={rightHip.y} fontSize="10">R.Hip</text>
                  <text x={leftKnee.x - 15} y={leftKnee.y} fontSize="10">L.Knee</text>
                  <text x={rightKnee.x + 10} y={rightKnee.y} fontSize="10">R.Knee</text>
                  <text x={leftAnkle.x - 15} y={leftAnkle.y} fontSize="10">L.Ankle</text>
                  <text x={rightAnkle.x + 10} y={rightAnkle.y} fontSize="10">R.Ankle</text>
                </g>
              )}
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Activity size={24} />
              <span className="text-sm font-medium">STEP COUNT</span>
            </div>
            <div className="text-3xl font-bold">{stepCount}</div>
            <div className="text-sm opacity-90">steps</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Target size={24} />
              <span className="text-sm font-medium">CADENCE</span>
            </div>
            <div className="text-3xl font-bold">{cadence.toFixed(0)}</div>
            <div className="text-sm opacity-90">steps/min</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={24} />
              <span className="text-sm font-medium">TIME</span>
            </div>
            <div className="text-3xl font-bold">{timeElapsed.toFixed(1)}</div>
            <div className="text-sm opacity-90">seconds</div>
          </div>
        </div>

        <div className="text-center">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Gait Analysis
            </button>
          ) : (
            <div className="flex items-center justify-center gap-3 text-blue-600">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold">Recording... {(15 - timeElapsed).toFixed(1)}s remaining</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GaitAnalysisApp;